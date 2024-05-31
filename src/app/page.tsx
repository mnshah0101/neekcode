"use client";
import { set } from "mongoose";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { AiFillLike } from "react-icons/ai";
import { FaEye } from "react-icons/fa";

const shortenText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

interface Answer {
  username: string;
  email: string;
  file_url: string;
  likes: number;
  id: string;
}
const fakeAnswers: Answer[] = [
  // ... (existing fake answers)
];

const question_id = "1";

function App() {
  const [answers, setAnswers] = useState<Answer[]>(fakeAnswers);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);

  const likeSolution = async (solution_id: string) => {
    try {
      let likedSolutions = localStorage.getItem("liked_solutions");
      if (likedSolutions) {
        likedSolutions = JSON.parse(likedSolutions);
        // @ts-ignore
        if (likedSolutions.includes(solution_id)) {
          console.log("disliking solution");
          const formData = new FormData();
          formData.append("solution_id", solution_id);
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER}/dislike`,
            {
              method: "POST",
              body: formData,
            }
          );
          if (response.ok) {
            getSolutions();
            // @ts-ignore
            likedSolutions = likedSolutions.filter(
              (id: string) => id !== solution_id
            );
            localStorage.setItem(
              "liked_solutions",
              JSON.stringify(likedSolutions)
            );
          } else {
            console.error("Failed to dislike solution");
          }
          return;
        }
      }
      console.log("liking solution");
      console.log(solution_id);
      const formData = new FormData();
      formData.append("solution_id", solution_id);
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/like`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        getSolutions();

        let likedSolutions = localStorage.getItem("liked_solutions");

        if (likedSolutions) {
          likedSolutions = JSON.parse(likedSolutions);
          // @ts-ignore
          likedSolutions.push(solution_id);
          localStorage.setItem(
            "liked_solutions",
            JSON.stringify(likedSolutions)
          );
        } else {
          // @ts-ignore
          likedSolutions = [solution_id];
          localStorage.setItem(
            "liked_solutions",
            JSON.stringify([likedSolutions])
          );
        }
      } else {
        console.error("Failed to like solution");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getSolutions();
    const my_question_id = localStorage.getItem("question_id");
    if (my_question_id) {
      if (my_question_id === question_id) {
        setHasAnswered(true);
      }
    }
  }, []);

  const getSolutions = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/solutions?question_id=${question_id}`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const data = await response.json();

        setAnswers(data.solutions);
      } else {
        console.error("Failed to fetch solutions");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (hasAnswered) {
      setError("You have already submitted a solution");
      return;
    }

    if (name && email && file) {
      try {
        let formData = new FormData();

        formData.append("file", file);
        formData.append("username", name);
        formData.append("email", email);
        formData.append("question_id", question_id);
        formData.append("date", new Date().toISOString());
        formData.append("likes", "0");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER}/solution`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          setName("");
          setEmail("");
          setFile(null);
          setIsFormVisible(false);
          localStorage.setItem("question_id", question_id);
          setHasAnswered(true);
        } else {
          console.error("Failed to submit solution");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      setError("Missing required fields");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="fill-contain" style={{ height: "10rem" }}></div>

      <h1 className="text-3xl font-bold mb-4 text-center">neekcode</h1>
      <p className="mb-4 text-center">
        how many jerks does it take to turn on a light bulb?
      </p>
      <button
        onClick={() => setIsFormVisible(!isFormVisible)}
        className="bg-black text-white py-2 px-4 rounded mb-6"
      >
        upload solution
      </button>

      <div className={`drop-down-form ${isFormVisible ? "open" : ""}`}>
        <div className="p-8 border rounded w-96 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                className="border rounded w-full p-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Fat Nuts"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="border rounded w-full p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="fatnuts@gmail.com"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">File</label>

              {file ? (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-30 border-2 border-gray-300 border-dashed rounded-lg">
                    <p className="mb-2 text-sm text-gray-500 flex justify-center flex-col items-center">
                      File upload completed:{" "}
                      <span className="font-semibold">{file.name}</span>
                    </p>
                  </label>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-30 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className="w-8 h-8 mb-2 mt-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5 a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf, image/*"
                    />
                  </label>
                </div>
              )}
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-gray border-gray-300 border border-dashed text-gray-500 p-2 rounded w-full"
              >
                Submit
              </button>
            </div>
          </form>

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>

      <div
        className="top_answers my-10 max-w-4xl overflow-y-auto"
        style={{ maxHeight: "400px" }}
        id="top-answers"
      >
        <h2 className="text-2xl font-bold mb-4">top answers</h2>
        <table className="min-w-full border">
          <thead className="sticky top-0 bg-gray-200">
            <tr>
              <th className="border px-4 py-2">username</th>
              <th className="border px-4 py-2">view</th>
              <th className="border px-4 py-2">likes</th>
            </tr>
          </thead>
          <tbody>
            {answers.map((answer, index) => (
              <tr key={index}>
                <td style={{ width: "10rem" }} className="border px-4 py-2">
                  {shortenText(answer.username, 30).toLowerCase()}
                </td>
                <td style={{ width: "2rem" }} className="border px-4 py-2">
                  <a className="flex justify-center" href={answer.file_url}>
                    <FaEye />
                  </a>
                </td>
                <td style={{ width: "3rem" }} className="border px-4 py-2">
                  <div className="flex items-center">
                    <span className="mr-2">{answer.likes}</span>
                    <button
                      onClick={() => likeSolution(answer.id)}
                      className="p-1 rounded"
                    >
                      <AiFillLike />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
