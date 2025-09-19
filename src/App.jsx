
import AppRouter from "./routes/Router";
import { useAppInit } from "./hooks";

function App() {
  // Initialize app state and auth checking
  useAppInit();

  return <AppRouter />;
}

export default App;
