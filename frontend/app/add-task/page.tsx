"use client"
import UseAppContext from "@/ContextApi/UseContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

interface updateDataType {
  text: string
}
export default function Home() {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [todoList, setTodoList] = useState<any>([]);
  const [update, setUpdate] = useState(false);
  const [updateData, setUpdateData] = useState<updateDataType>({ text: "" });
  const [updateIndex, setUpdateIndex] = useState<number | null>(null);

  const router = useRouter();

  const { setLoggedIn, setCurrentUser, currentUser, setLoadingData } = UseAppContext();

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

  }, [success, error])

  useEffect(() => {
    if (!currentUser) {
      router.push("/");
      setError("Please login to continue");
    }
  }, [currentUser])


  // const addNewTodo = async (e: any) => {
  //   if (!e.target.value.trim()) {
  //     return;
  //   }
  //   if (e.code == "Enter") {
  //     console.log(e.target.value, "todo text");
  //     setTodoList([{ text: e.target.value, completed: false }, ...todoList]);
  //     e.target.value = "";
  //   }
  // }

  const addNewTodo = async (e: any) => {
    if (!updateData.text.trim()) return;

    if (e.code === "Enter") {
      setTodoList([{ text: updateData.text, completed: false }, ...todoList]);
      setUpdateData({ text: "" }); // clear input
    }
  };

  const completeIncompleteTodo = async (index: any) => {
    let temp: any = todoList;
    temp[index].completed = !temp[index].completed;
    setTodoList([...temp]);
  }

  const deleteTodo = async (index: any) => {
    let temp = todoList;
    temp.splice(index, 1);
    setTodoList([...temp]);
  }

  const updateTodo = async (data: any, index: number) => {
    setUpdateData(data);
    setUpdateIndex(index);
    setUpdate(true);
  };

  const handleUpdateTodo = async (e: any) => {
    if (!updateData.text.trim()) return;

    if (e.code === "Enter" && updateIndex !== null) {
      const updatedList = [...todoList];
      console.log(updatedList, "updatedList");
      updatedList[updateIndex] = { ...updatedList[updateIndex], text: updateData.text };
      setTodoList(updatedList);
      setUpdate(false);
      setUpdateIndex(null);
      setUpdateData({ text: "" });
    }
  };

  return (
    <div className="mx-20">
      <h1 className="text-4xl text-center mt-5">Task App</h1>

      <div className="bg-gray-400 p-5 mt-5">
        <div className="">
          <input
            type="text"
            className="bg-white w-full p-3 rounded border border-gray-300"
            placeholder="Add your task here...."
            value={updateData.text} // always set value
            onChange={(e) => setUpdateData({ text: e.target.value })} // always set state
            onKeyDown={(e) => update ? handleUpdateTodo(e) : addNewTodo(e)}
          />
        </div>

        <div className="">
          <ul>
            {
              todoList.map((data: any, index: any) => {
                return (
                  <div key={index} className="bg-white border border-gray-300 p-3 rounded mt-3">
                    <div className="inline-flex">
                      <input type="checkbox" checked={data?.completed} onChange={() => { }} />
                      {
                        data?.completed ? <>
                          <del><li className="ms-2 text-lg font-medium">{data?.text}</li></del>
                        </> : <>
                          <li className="ms-2 text-lg font-medium">{data?.text}</li>
                        </>
                      }
                    </div>
                    <div>
                      {
                        data?.completed ? <>
                          <button className="bg-orange-400 text-white px-5 py-2 rounded-lg cursor-pointer" onClick={() => completeIncompleteTodo(index)}>Mark as incomplete</button>
                        </> : <>
                          <button className="bg-green-600 text-white px-5 py-2 rounded-lg cursor-pointer" onClick={() => completeIncompleteTodo(index)}>Mark as complete</button>
                          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg ms-2 cursor-pointer" onClick={() => { updateTodo(data, index); setUpdate(true); }}>Update</button>
                        </>
                      }
                      <button className="bg-red-600 text-white px-5 py-2 rounded-lg ms-2 cursor-pointer" onClick={() => deleteTodo(index)}>Delete</button>
                    </div>
                  </div>
                )
              })
            }
          </ul>
        </div>
      </div>
    </div>
  );
}