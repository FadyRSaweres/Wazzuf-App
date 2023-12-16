import React from "react";
import { useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { selectAllJobs } from "../../redux/JobsSlice";
import { selectAllSkills, selectSkillById } from "../../redux/SkillSlice";
import { RootState } from "../../store/store";
import { Skill } from "../../types";
import "./style.css";

export default function SkillDetails() {
  const { id } = useParams<{ id: string }>();
  const skill: Skill = useSelector((state: RootState) =>
    selectSkillById(state, id || "")
  );
  const arrSkills = useSelector(selectAllSkills);
  const AllJobs = useSelector(selectAllJobs);
  return (
    <div className="skill-details-container">
      <h1>{skill?.attributes?.name}</h1>
      <div className="grid-skills">
        <div className="related-jobs-container">
          {skill?.relationships?.jobs?.length > 0 && (
            <>
              <h3>Description: </h3>
              <p>
                knowledge of principles and methods for moving people or goods
                by air, rail, sea, or road, including the relative costs and
                benefits.
              </p>
              <h3>Related Jobs</h3>
              {skill?.relationships?.jobs?.map((job, index) => {
                const selectedJob = AllJobs.find((j) => j.id === job.id);
                return (
                  <div key={`${index + 1}`} className="job-card">
                    <NavLink to={`/job/${job?.id}`} className="navLink">
                      <h3>{selectedJob?.attributes?.title}</h3>
                    </NavLink>
                    <div className="job-details">
                      <p style={{ fontWeight: "bold" }}>
                        Importance:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {selectedJob?.type}
                        </span>
                      </p>
                      <p style={{ fontWeight: "bold" }}>
                        Level:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {selectedJob?.type}
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
        <div className="related-skills-container">
          <h3>Related Jobs: </h3>
          <ul>
            {skill?.relationships?.skills?.map((skill, index) => {
              const skillSelected = arrSkills.find((s) => s.id === skill.id);
              if (skillSelected) {
                return (
                  <li key={`${index + 1}`} className="list">
                    <NavLink
                      className="navLink"
                      to={`/skill/${skillSelected && skillSelected.id}`}
                    >
                      {skillSelected?.attributes?.name}
                    </NavLink>
                  </li>
                );
              } else return null;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
