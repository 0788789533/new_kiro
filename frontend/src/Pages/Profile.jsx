import { useState } from "react";

export default function Profile({ user }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
  });

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Profile</h2>
      <div className="bg-white rounded-2xl shadow p-6 max-w-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            {user.firstname[0]}{user.lastname[0]}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-lg">{user.firstname} {user.lastname}</p>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            { label: "First Name", value: user.firstname },
            { label: "Last Name", value: user.lastname },
            { label: "Email", value: user.email, full: true },
            { label: "Member Since", value: new Date(user.date).toLocaleDateString(), full: true },
          ].map((f) => (
            <div key={f.label} className={f.full ? "col-span-2" : ""}>
              <p className="text-gray-400 mb-1">{f.label}</p>
              <p className="font-medium text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">{f.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
