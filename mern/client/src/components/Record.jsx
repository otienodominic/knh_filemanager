import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Record() {
  const [form, setForm] = useState({
    patientNumber: "",
    patientName: "",
    phoneNumber: "",     
    dateOfBirth: "",
    gender: "", 
    viralLoad: "", 
    visitDate:"",  
    appointmentDate:"",
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if(!id) return;
      setIsNew(false);
      const response = await fetch(
        `http://localhost:5050/record/${params.id.toString()}`
      );
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const record = await response.json();
      if (!record) {
        console.warn(`Record with id ${id} not found`);
        navigate("/");
        return;
      }
      setForm(record);
    }
    fetchData();
    return;
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();
    const person = { ...form };
    try {
      let response;
      if (isNew) {
        // if we are adding a new record we will POST to /record.
        response = await fetch("http://localhost:5050/record", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      } else {
        // if we are updating a record we will PATCH to /record/:id.
        response = await fetch(`http://localhost:5050/record/${params.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('A problem occurred adding or updating a record: ', error);
    } finally {
      setForm({ patientNumber: "",
      patientName: "",
      phoneNumber: "",     
      dateOfBirth: "",
      gender: "", 
      viralLoad: "", 
      visitDate:"",  
      appointmentDate:""});
      navigate("/");
    }
  }

  // This following section will display the form that takes the input from the user.
  return (
    <>
  <h3 className="text-lg font-semibold p-4">Create/Update Patient Record</h3>
  <form onSubmit={onSubmit} className="border rounded-lg overflow-hidden p-4">
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-2">
      <div>
        <h2 className="text-base font-semibold leading-7 text-slate-900">Patient Info</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          This information will be displayed publicly so be careful what you share.
        </p>
      </div>

      <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8">
        <div className="sm:col-span-4">
          <label htmlFor="patientNumber" className="block text-sm font-medium leading-6 text-slate-900">
            Patient Number
          </label>
          <div className="mt-2">
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="text"
                name="patientNumber"
                id="patientNumber"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                value={form.patientNumber}
                onChange={(e) => updateForm({ patientNumber: e.target.value })}
              />
            </div>
          </div>
        </div>
        
        <div className="sm:col-span-4">
          <label htmlFor="patientName" className="block text-sm font-medium leading-6 text-slate-900">
            Patient Name
          </label>
          <div className="mt-2">
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="text"
                name="patientName"
                id="patientName"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                value={form.patientName}
                onChange={(e) => updateForm({ patientName: e.target.value })}
              />
            </div>
          </div>
        </div>
        
        <div className="sm:col-span-4">
          <label htmlFor="phoneNumber" className="block text-sm font-medium leading-6 text-slate-900">
            Phone Number
          </label>
          <div className="mt-2">
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                value={form.phoneNumber}
                onChange={(e) => updateForm({ phoneNumber: e.target.value })}
              />
            </div>
          </div>
        </div>
        
        <div className="sm:col-span-4">
          <label htmlFor="dateOfBirth" className="block text-sm font-medium leading-6 text-slate-900">
            Date of Birth
          </label>
          <div className="mt-2">
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                value={form.dateOfBirth}
                onChange={(e) => updateForm({ dateOfBirth: e.target.value })}
              />
            </div>
          </div>
        </div>
        
        <div className="sm:col-span-4">
          <label htmlFor="gender" className="block text-sm font-medium leading-6 text-slate-900">
            Gender
          </label>
          <div className="mt-2">
            <select
              name="gender"
              id="gender"
              className="block w-full rounded-md border-0 bg-transparent py-1.5 pl-3 pr-10 text-slate-900 focus:ring-0 sm:text-sm sm:leading-6"
              value={form.gender}
              onChange={(e) => updateForm({ gender: e.target.value })}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        
        <div className="sm:col-span-4">
          <label htmlFor="viralLoad" className="block text-sm font-medium leading-6 text-slate-900">
            Viral Load
          </label>
          <div className="mt-2">
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="text"
                name="viralLoad"
                id="viralLoad"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                value={form.viralLoad}
                onChange={(e) => updateForm({ viralLoad: e.target.value })}
              />
            </div>
          </div>
        </div>
        
        <div className="sm:col-span-4">
          <label htmlFor="visitDate" className="block text-sm font-medium leading-6 text-slate-900">
            Visit Date
          </label>
          <div className="mt-2">
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="date"
                name="visitDate"
                id="visitDate"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                value={form.visitDate}
                onChange={(e) => updateForm({ visitDate: e.target.value })}
              />
            </div>
          </div>
        </div>
        
        <div className="sm:col-span-4">
          <label htmlFor="appointmentDate" className="block text-sm font-medium leading-6 text-slate-900">
            Appointment Date
          </label>
          <div className="mt-2">
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="date"
                name="appointmentDate"
                id="appointmentDate"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                value={form.appointmentDate}
                onChange={(e) => updateForm({ appointmentDate: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <input
      type="submit"
      value="Save Patient Record"
      className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4"
    />
  </form>
</>

  );
}
