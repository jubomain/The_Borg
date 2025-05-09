// Export components with named exports instead of default exports
export { default as BrowserController } from "./BrowserController"
export { default as BrowserSessionPanel } from "./BrowserSessionPanel"
export { default as TaskManager } from "./TaskManager"
export { default as ResultsPanel } from "./ResultsPanel"

// Also provide direct exports for cases where default import is used
import BrowserControllerComponent from "./BrowserController"
import BrowserSessionPanelComponent from "./BrowserSessionPanel"
import TaskManagerComponent from "./TaskManager"
import ResultsPanelComponent from "./ResultsPanel"

// Re-export as both named and default exports
export {
  BrowserControllerComponent as default,
  BrowserSessionPanelComponent,
  TaskManagerComponent,
  ResultsPanelComponent,
}
