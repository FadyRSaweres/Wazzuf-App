import React from "react";
import { NavLink } from "react-router-dom";
import { CardJobProps } from "../../types";
import "./style.css";
export default function JobCard({
  cardHeader,
  cardSkills,
  cardLink,
}: CardJobProps) {
  return (
    <div className="card-container">
      <h2>{cardHeader}</h2>
      {cardSkills && (
        <div style={{ marginBottom: "30px" }}>
          <h3>Related Skills: </h3>
          <div className="skills-container">
            {cardSkills.map((skill, index) => (
              <div key={`${index + 1}`} className="skill">
                <h3 className="skill-title">{skill}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
      <NavLink to={`/job/${cardLink}`} id="link">
        <h4>View Job Details</h4>
      </NavLink>
    </div>
  );
}
