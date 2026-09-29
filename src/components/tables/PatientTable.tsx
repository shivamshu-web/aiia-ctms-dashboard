import { Patient } from '@/types/patient';

export default function PatientTable({ patients }: { patients: Patient[] }) {
  return (
    <table className="w-full text-left text-xs text-slate-300">
      <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px]">
        <tr>
          <th className="p-3">Patient Code</th>
          <th className="p-3">Age</th>
          <th className="p-3">Gender</th>
          <th className="p-3">Enrolled Date</th>
        </tr>
      </thead>
      <tbody>
        {patients.map((p) => (
          <tr key={p.id} className="border-b border-slate-800">
            <td className="p-3 text-emerald-400">{p.patientCode}</td>
            <td className="p-3">{p.age}</td>
            <td className="p-3">{p.gender}</td>
            <td className="p-3">{p.enrolledAt}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
