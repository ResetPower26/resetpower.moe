import { Button } from "@base-ui/react";
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <div>Hello, world!</div>
      <div>You've clicked {count} times.</div>
      <Button onClick={() => setCount(count + 1)}>Increase</Button>
    </div>
  );
}

export default App;
