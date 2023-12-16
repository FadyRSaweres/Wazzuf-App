import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import SnakBar from "../../components/snakBar";
import {
  fetchJobs,
  selectAllJobs,
  selectJobById,
  selectJobIds,
} from "../../redux/JobsSlice";
import { selectedSearchedJobsById } from "../../redux/SearchSlice";
import { selectAllSkills } from "../../redux/SkillSlice";
import { AppDispatch, RootState } from "../../store/store";
import { Job, LocalstorageProps, Meta, statusBar } from "../../types";
import "./style.css";

export default function JobDetails() {
  const AllIds = useSelector(selectJobIds);
  const { status: jobStatus, error } = useSelector(
    (state: RootState) => state.searchJobs
  );
  const dispatch: AppDispatch = useDispatch();
  const [jobDetails, setJobDetails] = useState<Job>({} as Job);
  const { id } = useParams<{ id: string }>();
  const job: Job = useSelector((state: RootState) =>
    selectJobById(state, id || "")
  );
  const jobSearch: Job = useSelector((state: RootState) =>
    selectedSearchedJobsById(state, id || "")
  );
  const arrSkills = useSelector(selectAllSkills);
  const AllJobs = useSelector(selectAllJobs);
  const skillDetails = jobDetails?.relationships?.skills.map((skill) =>
    arrSkills.find((sk) => sk.id === skill.id)
  );

  //
  useMemo(
    () =>
      skillDetails?.forEach((skill) =>
        skill?.relationships?.jobs?.forEach((job) => {
          if (!AllIds.includes(job.id)) {
            dispatch(fetchJobs({ id: job?.id } as Meta));
          }
        })
      ),
    [AllIds, dispatch, skillDetails]
  );
  useEffect(() => {
    if (job) {
      setJobDetails(job);
    } else {
      setJobDetails(jobSearch);
    }
  }, [job, jobSearch]);

  useEffect(() => {
    const existingArray: LocalstorageProps[] = JSON.parse(
      localStorage.getItem("SEARCH-HISTORY") || "[]"
    );
    console.log(
      jobDetails?.attributes?.title,
      jobDetails.id,
      existingArray.find(
        (local) => local?.id === jobDetails.id && jobDetails.id !== undefined
      ),
      "fff"
    );
    if (
      (jobDetails?.attributes?.title &&
        jobDetails.id &&
        !!!existingArray.find(
          (local) => local?.id === jobDetails.id && jobDetails.id !== undefined
        ) &&
        existingArray.length <= 10) ||
      Object.keys(existingArray).length === 0
    ) {
      existingArray.push({
        id: jobDetails?.id,
        value: jobDetails?.attributes?.title,
      });
      // setHistoryState(existingArray);
      window.localStorage.setItem(
        "SEARCH-HISTORY",
        JSON.stringify(existingArray)
      );
    }
    if (existingArray.length >= 10) {
      window.localStorage.clear();
    }
  }, [jobDetails?.attributes?.title, jobDetails?.id]);

  return (
    <div className="job-details-container">
      <SnakBar
        show={jobStatus === statusBar.error}
        message={error} // Pass your message here
        duration={3000}
      />
      <h1>{jobDetails?.attributes?.title}</h1>
      <div className="grid-2">
        <div className="related-skills">
          {jobDetails?.relationships?.skills?.length > 0 && (
            <>
              <h3>Related Skills</h3>
              {skillDetails?.map((skill, index) => {
                return (
                  <div key={`${index + 2}`} className="skill-card">
                    <NavLink to={`/skill/${skill?.id}`} className="navLink">
                      <h3>{skill?.attributes?.name}</h3>
                    </NavLink>
                    <p>
                      the ability to communicate information and ideas in
                      speaking so others will understand.
                    </p>
                    <div className="skill-details">
                      <p style={{ fontWeight: "bold" }}>
                        Type:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {skill?.type}
                        </span>
                      </p>
                      <p style={{ fontWeight: "bold" }}>
                        Importance:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {skill?.attributes.importance}
                        </span>
                      </p>
                      <p style={{ fontWeight: "bold" }}>
                        Level:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {skill?.attributes.level}
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
        <div className="related-jobs">
          <h3>Related Jobs: </h3>
          <ul>
            {skillDetails?.map((skill) =>
              skill?.relationships?.jobs
                ?.filter((j) => j.id !== id)
                .map((job, index) => (
                  <li key={`${index + 1}`} className="list">
                    <NavLink
                      className="navLink"
                      to={`/job/${
                        AllJobs.find((jobDetail) => jobDetail.id === job.id)?.id
                      }`}
                    >
                      {
                        AllJobs.find((jobDetail) => jobDetail.id === job.id)
                          ?.attributes.title
                      }
                    </NavLink>
                  </li>
                ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
