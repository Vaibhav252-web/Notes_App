import { useState } from "react";
import NavBar from "./NavBar";
import CreateNote from "./createNote";
import AllNotes from "./AllNotes";

const Dashboard = () => {
  const [value, setValue] = useState(0);

  return (
    <div>
      <NavBar value={value} onChange={setValue} />

      {value === 0 && <CreateNote onCreated={() => setValue(1)} />}

      {value === 1 && <AllNotes />}
    </div>
  );
};

export default Dashboard;
