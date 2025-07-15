"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import UseAppContext from '@/ContextApi/UseContext';
import AppNavbar from '@/components/Navbar';
import axios from 'axios';

type Task = {
  task: string;
  owner: string;
  dueDate: string;
  status: 'Done' | 'Stuck' | 'Pending';
  people: string[];
  timeline: string;
};

const getStatusStyle = (status: Task['status']) => {
  const base = 'px-2 py-1 rounded-full text-xs font-medium';
  switch (status) {
    case 'Done':
      return `${base} bg-green-100 text-green-800`;
    case 'Stuck':
      return `${base} bg-red-100 text-red-800`;
    case 'Pending':
      return `${base} bg-blue-100 text-blue-800`;
    default:
      return base;
  }
};

const TaskTable = ({ title, data }: { title: any, data: any }) => (
  <div className="bg-white shadow-md rounded-lg mb-10">
    <div className="px-6 py-4 border-b">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {['Task', 'Owner', 'Status'].map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {data.map((task: any, index: any) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-gray-700">{task.task}</td>
              <td className="px-6 py-4">
                <div className='flex'>
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src="/avatar.png"
                      alt="Owner"
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                  <div className='my-auto ms-1'>
                    {task?.user_id?.name}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={getStatusStyle(task.status)}>{task.status}</span>
              </td>
              {/* <td className="px-6 py-4 text-gray-600">{task.dueDate}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const router = useRouter();
  const { setLoggedIn, setCurrentUser, currentUser, setLoadingData } = UseAppContext();

  useEffect(() => {
    getAllTasks();
  }, [])


  const getAllTasks = async () => {
    try {
      const token = sessionStorage.getItem("token")
      const res = await axios.get(process.env.apiUrl + `/get-all-tasks`);
      setTasks(res?.data?.result);
    } catch (error) {

    }
  }

  return (
    <>
      <main className="min-h-screen bg-gray-200 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <TaskTable title="Browse Tasks" data={tasks} />
          {/* <TaskTable title="Completed" data={tasks.completed} /> */}
        </div>
      </main>
    </>
  );
}
