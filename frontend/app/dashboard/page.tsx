"use client"
import UseAppContext from '@/ContextApi/UseContext';
import { Cancel, Close, Edit, MoreHoriz } from '@mui/icons-material';
import { Backdrop, ClickAwayListener, Menu, MenuItem } from '@mui/material';
import axios from 'axios';
import { Spinner } from 'flowbite-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';


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



const Dashboard = () => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [option, setOption] = useState<number>();
    const [editTitle, setEditTitle] = useState("");
    const [editStatus, setEditStatus] = useState("");
    const [editTaskId, setEditTaskId] = useState("");
    const [openEditModel, setOpenEditModel] = useState(false);

    const { setLoggedIn, setCurrentUser, currentUser, setLoadingData, loadingData } = UseAppContext();

    const router = useRouter();
    const pathName = usePathname();

    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    }

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

    useEffect(() => {
        if(currentUser){
            getAllTasks();
        }
    }, [currentUser])


    const getAllTasks = async () => {
        try {
            const token = sessionStorage.getItem("token")
            const res = await axios.post(process.env.apiUrl + `/get-all-tasks-user`, {
                user_id: currentUser?._id
            }, { headers: { Authorization: `Bearer ${token}` } });
            setTasks(res?.data?.result);
        } catch (error) {

        }
    };

    const handleDeleteTask = async (task_id: any) => {
        try {
            const token = sessionStorage.getItem("token");
            const res = await axios.post(process.env.apiUrl + `/delete-task`, {
                task_id
            }, { headers: { Authorization: `Bearer ${token}` } });
            setSuccess(res?.data?.message);
            getAllTasks();
        } catch (error: any) {
            if (error?.response?.data?.message) {
                setError(error?.response?.data?.message);
            } else {
                setError("Something went wrong")
            }
        }
    }

    const DeleteTaskAlert = (task_id: any) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete this question?",
            // icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "",
            confirmButtonText: "Yes, delete it!"
        }).then((result: any) => {
            if (result.isConfirmed) {
                handleDeleteTask(task_id)
            }
        });
    }

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
        setEditStatus(e.target.value);
    }

    const editTask = (data: any) => {
        // console.log(data, "data for edit");
        setEditTitle(data?.task);
        setEditStatus(data?.status);
        setEditTaskId(data?._id);
        setOpenEditModel(true);
    }

    const handleUpdateTask = async () => {
        if(editStatus == "0"){
            setError("Please select status");
            return;
        }
        try {
            setLoading(true);
            const token = sessionStorage.getItem("token")
            const res = await axios.post(process.env.apiUrl + `/update-task`, {
                task_id: editTaskId,
                task: editTitle,
                status: editStatus
            }, {headers: {Authorization: `Bearer ${token}`}})
            setSuccess(res?.data?.message);
            setEditTaskId("");
            setEditStatus("");
            setEditTitle("");
            getAllTasks();
            setLoading(false);
            setOpenEditModel(false);
        } catch (error: any) {
            if(error?.response?.data?.message){
                setError(error?.response?.data?.message);
            }else{
                setError("Something went wrong");
            }
            setLoading(false);
        }
    }

    const TaskTable = ({ title, data }: { title: any, data: any }) => (
        <div className="bg-white shadow-md rounded-lg mb-10">
            <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            {['Task', 'Action', 'Owner', 'Status'].map((header) => (
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
                                <td className="px-4 py-4 cursor-pointer  relative">
                                    <button
                                        onClick={() => {
                                            if (option == index + 1) {
                                                setOption(0);
                                            } else {
                                                setOption(index + 1);
                                            }
                                        }}
                                        className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none "
                                        type="button"
                                    >
                                        <MoreHoriz className="text-orange-500 z-10" />
                                    </button>
                                    {option == index + 1 ? (
                                        <ClickAwayListener
                                            onClickAway={() => {
                                                setOption(0);
                                            }}
                                        >
                                            <div className={`${(data.length - 1) == index ? "left-14 bottom-5" : "left-14 top-9"} absolute border border-gray-100 w-28 bg-white rounded divide-y divide-gray-100 shadow}`} style={{ zIndex: 100 }}>
                                                <ul
                                                    className=" text-sm text-gray-700 cursor-pointer"
                                                    aria-labelledby="apple-imac-20-dropdown-button"
                                                >
                                                    <li
                                                        onClick={() => {
                                                            setOption(0);
                                                            editTask(task);
                                                        }}
                                                    >
                                                        <div className="inline-flex hover:bg-gray-100 w-full ps-4">
                                                            <Edit className="mt-2" htmlColor="orange" />
                                                            <span className="block py-2 px-4 cursor-pointer text-center">
                                                                Edit
                                                            </span>
                                                        </div>
                                                    </li>

                                                    <li
                                                        onClick={() => {
                                                            DeleteTaskAlert(task?._id)
                                                            setOption(0);
                                                        }}
                                                    >
                                                        <span className="block py-2 px-4 hover:bg-gray-100 cursor-pointer">
                                                            <Cancel className="me-3" fontSize="small" sx={{ color: "red" }} />
                                                            Delete
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </ClickAwayListener>
                                    ) : (
                                        ""
                                    )}
                                </td>
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


    return (
        <>
            {
                currentUser ? <>
                    <main className="min-h-screen bg-gray-200 py-10 px-6">
                        <div className="max-w-7xl mx-auto">
                            <TaskTable title="Browse Tasks" data={tasks} />
                            {/* <TaskTable title="Completed" data={tasks.completed} /> */}
                        </div>
                    </main>
                </> : <>
                    <div className='h-screen flex justify-center items-center'>
                        <Spinner />
                    </div>
                </>
            }


            {/* Edit Task Model */}
            {openEditModel ? (
                <Backdrop
                    sx={{ color: "", zIndex: (theme: any) => theme.zIndex.drawer + 1 }}
                    open={openEditModel}
                >
                    <div
                        tabIndex={-1}
                        id="static-modal"
                        data-modal-backdrop="static"
                        aria-hidden="true"
                        className="static-modal bg-white rounded-lg shadow top-[15%] lg:left-[32%] lg:w-[40%] md:w-[80%] w-[80%] sm:flex-col sm:left[0%] max-h-[25rem] overflow-y-scroll no-scrollbar"
                    >
                        <div className=" p-4 w-full max-w-2xl max-h-full">
                            <div className="">
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                                    <h3 className="text-xl font-semibold text-gray-900 ">
                                        Edit Task
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setOpenEditModel(false);
                                            // setQuestion("")
                                            // setAnswer("")
                                            // setQuestionId("")
                                        }}
                                        type="button"
                                        className="text-black bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center cursor-pointer"
                                        data-modal-hide="static-modal"
                                    >
                                        <Close />
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>
                                {/* <!-- Modal body --> */}
                                <div className="p-4 md:p-5 space-y-4">
                                    <div>
                                        <label
                                            htmlFor="title"
                                            className="block mb-2 text-sm font-medium"
                                        >
                                            Task Title
                                        </label>
                                        <input
                                            value={editTitle}
                                            onChange={(e) => {
                                                setEditTitle(e.target.value);
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
                                        <select className='bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ' name="" id="" value={editStatus} onChange={handleSelectStatus}>
                                            <option className='' value="0">--Select--</option>
                                            {
                                                statusOptions.map((item: any, index: any) => {
                                                    return (
                                                        <option key={index} value={item?.status}>{item?.status}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                                {/* <!-- Modal footer --> */}
                                <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b ">
                                    <button
                                        onClick={() => handleUpdateTask()}
                                        data-modal-hide="static-modal"
                                        type="button"
                                        className="text-black bg-primary font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
                                        disabled={loading}
                                    >
                                        {
                                            loading ? "Please wait..." : "Submit"
                                        }

                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Backdrop>
            ) : (
                ""
            )}
        </>
    )
}

export default Dashboard