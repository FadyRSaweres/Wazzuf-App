import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs, selectAllJobs } from "../../redux/JobsSlice";
import { AppDispatch, RootState } from "../../store/store";
import { Meta, statusBar } from "../../types";
import Search from "../../assets/icons/Vector.svg";
import "./style.css";
import JobCard from "../../components/jobCard/JobCard";
import { useNavigate } from "react-router-dom";
import { selectAllSkills } from "../../redux/SkillSlice";
import Loading from "../../components/progress";
import SnakBar from "../../components/snakBar";

export default function AllJobs() {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const {
    meta,
    status: jobStatus,
    error,
  } = useSelector((state: RootState) => state.jobs);
  const arrJobs = useSelector(selectAllJobs);
  const arrSkills = useSelector(selectAllSkills);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDispatchFetch = () => {
    dispatch(fetchJobs(meta as Meta));
  };

  // handle search with debounce
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchVal = e.target.value;
    if (searchVal.length >= 3) {
      navigate(`/search?key=${searchVal}`);
    }
  };

  const handleScrollDown = useCallback(
    (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
      console.log(event.currentTarget.scrollTop, "Scroll");
    },
    []
  );

  // handle search with debounce
  useEffect(() => {
    if (jobStatus === statusBar.idle) {
      dispatch(fetchJobs(meta as Meta));
    }
  }, [dispatch, jobStatus, meta]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement || document.body;
      const atBottom =
        clientHeight - (scrollHeight - scrollTop) <= 20 &&
        clientHeight - (scrollHeight - scrollTop) >= -20;
      if (atBottom) {
        console.log("Hello iam last");
        handleDispatchFetch();
      } else {
        console.log(clientHeight - (scrollHeight - scrollTop), "FF");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleDispatchFetch]);

  return (
    <>
      {/* <button onClick={() => setSnackbarOpen(true)}>Show Snackbar</button> */}
      <SnakBar
        show={jobStatus === statusBar.error}
        message={error} // Pass your message here
        duration={3000}
      />
      <div className="all-job-container">
        <div className="search-space">
          <div className="search">
            <span className="fa fa-search">
              <img src={Search} alt="" />
            </span>
            <input placeholder="Search term" onChange={handleSearch} />
          </div>
        </div>
        <div className="job-list">
          <h2>All Jobs ({meta?.count || 0})</h2>
          <div className="job-containers" onScroll={handleScrollDown}>
            {arrJobs.map((job, index) => (
              <JobCard
                key={`${index + 1}`}
                cardHeader={job.attributes?.title || ""}
                cardSkills={
                  job?.relationships?.skills?.map(
                    (skill) =>
                      arrSkills.find((skillObj) => skillObj?.id === skill?.id)
                        ?.attributes?.name
                  ) || []
                }
                cardLink={job.id}
              />
            ))}
          </div>
        </div>
      </div>
      {jobStatus === statusBar.loading && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Loading />
        </div>
      )}
    </>
  );
}

// <input type={"button"} onClick={() => handleDispatchIncrement()} />
//       {isLoading && <h1>Loading...</h1>}
//       {arrJobs?.map((job, key) => (
//         <div key={`${key + 1}`} className="job-card">
//           <h4>{job?.id}</h4>
//           <h3>{job?.attributes?.title}</h3>
//           <h3>{job?.type}</h3>
//           {job?.relationships?.skills?.map((skill, index) => (
//             <h2>
//               Skill Name:{" "}
//               <span style={{ color: "red" }}>
//                 {
//                   arrSkills.find((skillObj) => skillObj?.id === skill?.id)
//                     ?.attributes?.name
//                 }
//               </span>
//             </h2>
//           ))}
//         </div>
//       ))}{" "}
