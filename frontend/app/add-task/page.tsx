"use client"
import UseAppContext from '@/ContextApi/UseContext';
import axios from 'axios';
import { Spinner } from 'flowbite-react';
import { usePathname, useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';

const AddTask = () => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { setLoggedIn, setCurrentUser, currentUser, setLoadingData, loadingData } = UseAppContext();

  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (!currentUser && !loadingData) {
      router.push("/signin");
      setError("Please login to continue");
    }
  }, [currentUser]);

  useEffect(() => {
    if (success != "") {
      enqueueSnackbar(success, {
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'bottom'
        },
        variant: 'success'
      })
      setSuccess('');
    }
    else if (error != "") {
      enqueueSnackbar(error, {
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'bottom'
        },
        variant: 'error'
      })
      setError('');
    }

  }, [success, error]);

  const statusOptions = [
    {
      id: 1,
      status: "Done"
    },
    {
      id: 2,
      status: "Pending"
    },
    {
      id: 3,
      status: "Stuck"
    },
  ];

  const handleSelectStatus = (e: any) => {
    console.log(e.target.value, "selected status");
    setStatus(e.target.value);
  }

  const handleAddTask = async () => {
    if (!title.trim()) {
      setError("Please provide task title");
      return;
    }
    if (!status || status == "0") {
      setError("Please select status");
      return;
    }
    try {
      setLoading(true);
      let token = sessionStorage.getItem('token');
      const res = await axios.post(process.env.apiUrl + `/add-task`, {
        user_id: currentUser?._id,
        task: title,
        status: status
      }, { headers: { Authorization: `Bearer ${token}` } })
      setSuccess(res?.data?.message);
      setTitle("");
      setStatus("0");
      setLoading(false);
      router.push("/")
    } catch (error: any) {
      if (error?.response?.data?.message) {
        setError(error?.response?.data?.message);
      } else {
        setError("Something went wrong");
      }
      setLoading(false);
    }
  }

  return (
    <>
      {
        currentUser ? <>
          <div className='w-[50%] mx-auto mt-20 shadow-xl bg-white p-5 rounded'>
            <h1 className='text-3xl text-center'>Add your tasks here</h1>
            <div className='mt-5'>
              <div>
                <label
                  htmlFor="title"
                  className="block mb-2 text-sm font-medium"
                >
                  Task Title
                </label>
                <input
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="Enter your task..."
                  required
                />
              </div>
              <div className='mt-4'>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium"
                >
                  Status
                </label>
                <select className='bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ' name="" id="" onChange={handleSelectStatus}>
                  <option className='' value="0">--Select--</option>
                  {
                    statusOptions.map((item, index) => {
                      return (
                        <option key={index} value={item?.status}>{item?.status}</option>
                      )
                    })
                  }
                </select>
              </div>
              <div className='mt-5'>
                <button className='bg-primary w-full py-2 rounded cursor-pointer' onClick={handleAddTask} disabled={loading}>
                  {
                    loading ? "Please wait" : "Submit"
                  }
                </button>
              </div>
            </div>
          </div>
        </> :
          <>
          <div className='h-screen flex justify-center items-center'>
            <Spinner />
          </div>
          </>
      }
    </>
  )
}

export default AddTask