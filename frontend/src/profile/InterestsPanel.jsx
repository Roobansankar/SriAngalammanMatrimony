import axios from "axios";
import { useEffect, useState } from "react";
import { connectSocket, getSocket } from "../socket";

export default function InterestsPanel() {
  const [incoming, setIncoming] = useState([]); // list of interest objects

  useEffect(() => {
    connectSocket();
    const socket = getSocket();

    const handleReceived = (payload) => {
      // payload.interest contains DB row
      setIncoming(prev => [payload.interest, ...prev]);
    };

    socket?.on("interest_received", handleReceived);

    return () => {
      socket?.off("interest_received", handleReceived);
    };
  }, []);

  const respond = async (id, action) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE || ""}/api/auth/interest/respond`, { interestId: id, action });
      if (res.data?.success) {
        setIncoming(prev => prev.map(i => i.id === id ? res.data.interest : i));
      }
    } catch (e) {
      console.error(e);
      alert("Failed to update");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-bold mb-2">Interests</h3>
      {incoming.length === 0 ? <div>No incoming interests</div> : null}
      {incoming.map(i => (
        <div key={i.id} className="flex items-center justify-between p-2 border-b">
          <div>
            From: <strong>{i.from_matriid}</strong><br />
            Status: <em>{i.status}</em>
          </div>
          <div>
            {i.status === "pending" && (
              <>
                <button onClick={() => respond(i.id, "accepted")} className="mr-2 px-3 py-1 rounded bg-green-500 text-white">Accept</button>
                <button onClick={() => respond(i.id, "rejected")} className="px-3 py-1 rounded bg-gray-300">Reject</button>
              </>
            )}
            {i.status !== "pending" && <div className="text-sm text-gray-500">{i.status}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
