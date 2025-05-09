import { exec } from "child_process"
import { promises as fs } from "fs"
import { promisify } from "util"
import os from "os"
import path from "path"

const execAsync = promisify(exec)

// Safety check to prevent dangerous commands
function isSafeCommand(command: string): boolean {
  const dangerousPatterns = [
    /rm\s+-rf/i,
    /mkfs/i,
    /dd\s+if/i,
    />\s+\/dev\//i,
    /format/i,
    /deltree/i,
    /shutdown/i,
    /reboot/i,
  ]

  return !dangerousPatterns.some((pattern) => pattern.test(command))
}

// Sanitize file paths to prevent directory traversal
function sanitizePath(filePath: string): string {
  // Normalize the path and ensure it doesn't go outside the allowed directory
  const normalizedPath = path.normalize(filePath)
  const safeBasePath = path.join(os.tmpdir(), "borg-agent-files")

  // Create the safe directory if it doesn't exist
  if (!fs.existsSync(safeBasePath)) {
    fs.mkdir(safeBasePath, { recursive: true })
  }

  // Ensure the path is within the safe directory
  const fullPath = path.join(safeBasePath, path.basename(normalizedPath))
  return fullPath
}

export const computerControlTools = [
  {
    name: "system_info",
    description: "Get system information such as OS, CPU, memory, etc.",
    parameters: {
      type: "object",
      properties: {
        info_type: {
          type: "string",
          enum: ["os", "cpu", "memory", "network", "all"],
          description: "Type of system information to retrieve",
        },
      },
      required: ["info_type"],
    },
    handler: async ({ info_type }) => {
      try {
        const info: Record<string, any> = {}

        if (info_type === "os" || info_type === "all") {
          info.os = {
            platform: os.platform(),
            release: os.release(),
            type: os.type(),
            arch: os.arch(),
            uptime: os.uptime(),
            hostname: os.hostname(),
          }
        }

        if (info_type === "cpu" || info_type === "all") {
          info.cpu = {
            model: os.cpus()[0].model,
            cores: os.cpus().length,
            speed: os.cpus()[0].speed,
            load: os.loadavg(),
          }
        }

        if (info_type === "memory" || info_type === "all") {
          info.memory = {
            total: os.totalmem(),
            free: os.freemem(),
            used: os.totalmem() - os.freemem(),
          }
        }

        if (info_type === "network" || info_type === "all") {
          info.network = {
            interfaces: os.networkInterfaces(),
          }
        }

        return info
      } catch (error) {
        return { error: `Failed to get system information: ${error.message}` }
      }
    },
  },

  {
    name: "list_directory",
    description: "List files and directories in a specified path",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Directory path to list",
        },
      },
      required: ["path"],
    },
    handler: async ({ path: dirPath }) => {
      try {
        const safePath = sanitizePath(dirPath)
        const files = await fs.readdir(safePath, { withFileTypes: true })

        return {
          path: safePath,
          items: files.map((file) => ({
            name: file.name,
            type: file.isDirectory() ? "directory" : "file",
            isDirectory: file.isDirectory(),
          })),
        }
      } catch (error) {
        return { error: `Failed to list directory: ${error.message}` }
      }
    },
  },

  {
    name: "read_file",
    description: "Read the contents of a file",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Path to the file",
        },
      },
      required: ["path"],
    },
    handler: async ({ path: filePath }) => {
      try {
        const safePath = sanitizePath(filePath)
        const content = await fs.readFile(safePath, "utf8")

        return {
          path: safePath,
          content,
          size: content.length,
        }
      } catch (error) {
        return { error: `Failed to read file: ${error.message}` }
      }
    },
  },

  {
    name: "write_file",
    description: "Write content to a file",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Path to the file",
        },
        content: {
          type: "string",
          description: "Content to write to the file",
        },
      },
      required: ["path", "content"],
    },
    handler: async ({ path: filePath, content }) => {
      try {
        const safePath = sanitizePath(filePath)
        await fs.writeFile(safePath, content, "utf8")

        return {
          path: safePath,
          success: true,
          size: content.length,
        }
      } catch (error) {
        return { error: `Failed to write file: ${error.message}` }
      }
    },
  },

  {
    name: "run_command",
    description: "Run a shell command (with safety restrictions)",
    parameters: {
      type: "object",
      properties: {
        command: {
          type: "string",
          description: "Command to execute",
        },
      },
      required: ["command"],
    },
    handler: async ({ command }) => {
      try {
        if (!isSafeCommand(command)) {
          return { error: "Command rejected for security reasons" }
        }

        const { stdout, stderr } = await execAsync(command, { timeout: 10000 })

        return {
          command,
          stdout,
          stderr,
          success: !stderr,
        }
      } catch (error) {
        return { error: `Failed to execute command: ${error.message}` }
      }
    },
  },

  {
    name: "process_list",
    description: "Get a list of running processes",
    parameters: {
      type: "object",
      properties: {
        filter: {
          type: "string",
          description: "Optional filter to apply to process names",
        },
      },
    },
    handler: async ({ filter }) => {
      try {
        let command = ""

        if (os.platform() === "win32") {
          command = "tasklist /fo csv /nh"
          if (filter) {
            command = `${command} | findstr /i "${filter}"`
          }
        } else {
          command = "ps -e -o pid,ppid,cpu,cmd"
          if (filter) {
            command = `${command} | grep -i "${filter}"`
          }
        }

        const { stdout } = await execAsync(command)

        // Parse the output based on platform
        let processes = []
        if (os.platform() === "win32") {
          // Parse Windows tasklist CSV output
          processes = stdout
            .split("\n")
            .filter((line) => line.trim())
            .map((line) => {
              const parts = line.split('","')
              if (parts.length >= 5) {
                return {
                  name: parts[0].replace('"', ""),
                  pid: Number.parseInt(parts[1], 10),
                  memoryUsage: parts[4].replace('"', "").replace(" K", ""),
                }
              }
              return null
            })
            .filter(Boolean)
        } else {
          // Parse Unix ps output
          processes = stdout
            .split("\n")
            .filter((line) => line.trim())
            .map((line) => {
              const parts = line.trim().split(/\s+/)
              if (parts.length >= 4) {
                return {
                  pid: Number.parseInt(parts[0], 10),
                  ppid: Number.parseInt(parts[1], 10),
                  cpu: Number.parseFloat(parts[2]),
                  command: parts.slice(3).join(" "),
                }
              }
              return null
            })
            .filter(Boolean)
        }

        return {
          count: processes.length,
          processes,
        }
      } catch (error) {
        return { error: `Failed to list processes: ${error.message}` }
      }
    },
  },

  {
    name: "network_scan",
    description: "Scan network for open ports on a specific host",
    parameters: {
      type: "object",
      properties: {
        host: {
          type: "string",
          description: "Host to scan (IP address or hostname)",
        },
        ports: {
          type: "string",
          description: "Ports to scan (e.g., '80,443,8080' or '1000-2000')",
        },
      },
      required: ["host", "ports"],
    },
    handler: async ({ host, ports }) => {
      try {
        // Validate host and ports for security
        if (!/^[a-zA-Z0-9.-]+$/.test(host)) {
          return { error: "Invalid host format" }
        }

        if (!/^[0-9,-]+$/.test(ports)) {
          return { error: "Invalid port format" }
        }

        let command = ""
        if (os.platform() === "win32") {
          // For Windows, use PowerShell's Test-NetConnection
          const portList = ports.includes("-")
            ? ports.split("-").map((p) => Number.parseInt(p.trim(), 10))
            : ports.split(",").map((p) => Number.parseInt(p.trim(), 10))

          const results = []
          for (const port of portList) {
            if (isNaN(port) || port < 1 || port > 65535) continue

            const { stdout } = await execAsync(
              `powershell -command "Test-NetConnection -ComputerName ${host} -Port ${port} -InformationLevel Quiet"`,
            )
            results.push({
              port,
              open: stdout.trim() === "True",
            })
          }

          return {
            host,
            scanned: results.length,
            results,
          }
        } else {
          // For Unix systems, use nc (netcat)
          command = `nc -zv ${host} ${ports} 2>&1`
          const { stdout, stderr } = await execAsync(command)
          const output = stdout + stderr

          // Parse netcat output
          const results = output
            .split("\n")
            .filter((line) => line.includes("open") || line.includes("succeeded"))
            .map((line) => {
              const portMatch = line.match(/port (\d+)/i) || line.match(/$$(\d+)$$/)
              if (portMatch) {
                return {
                  port: Number.parseInt(portMatch[1], 10),
                  open: true,
                }
              }
              return null
            })
            .filter(Boolean)

          return {
            host,
            scanned: results.length,
            results,
          }
        }
      } catch (error) {
        return { error: `Failed to scan network: ${error.message}` }
      }
    },
  },
]
