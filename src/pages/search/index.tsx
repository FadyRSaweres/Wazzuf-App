import { debounce } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import Search from "../../assets/icons/Vector.svg";
import AutocompleteMenue from "../../components/autoCompleteMenu";
import EmptyState from "../../components/emptyState";
import JobCard from "../../components/jobCard/JobCard";
import SnakBar from "../../components/snakBar";
import { searchJobs, selectAllSearchedJobs } from "../../redux/SearchSlice";
import { selectAllSkills } from "../../redux/SkillSlice";
import { AppDispatch, RootState } from "../../store/store";
import { Job, LocalstorageProps, statusBar } from "../../types";
import "./style.css";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [inputSearch, setInputSearch] = useState<string | undefined>("");
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [arrSearch, setArrSearch] = useState<Job[]>([]);
  const [historyState, setHistoryState] = useState<LocalstorageProps[]>([]);

  const { status: jobStatus, error } = useSelector(
    (state: RootState) => state.skills
  );
  const arrJobs = useSelector(selectAllSearchedJobs);
  const arrSkills = useSelector(selectAllSkills);

  const inputRef = useRef<HTMLInputElement>(null);
  const absoluteDivRef = useRef<HTMLDivElement>(null);
  // to reduce Api calling little bit
  const debouncedSearch = useRef(
    debounce(async (criteria: string) => {
      await dispatch(searchJobs(criteria));
    }, 300)
  ).current;

  async function handleChangeSearchInput(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const searchKey = e.target.value;
    setInputSearch(searchKey);
    console.log(inputSearch, "INNN");
    if (searchKey.length >= 3) {
      debouncedSearch(searchKey);
    }
  }

  const handleClickSearch = useCallback(() => {
    console.log(inputSearch, "inputSearch");
    setArrSearch(
      arrJobs.filter((job) =>
        job.attributes?.title
          .toLocaleLowerCase()
          .includes(inputSearch?.toLocaleLowerCase() || "")
      )
    );
    setShowOptions(false);
  }, [arrJobs, inputSearch]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleClickOutside = (event: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target as Node) &&
      absoluteDivRef.current &&
      !absoluteDivRef.current.contains(event.target as Node)
    ) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    setInputSearch(searchParams.get("key") || "");
    const existingArray: LocalstorageProps[] = JSON.parse(
      localStorage.getItem("SEARCH-HISTORY") || "[]"
    );
    setHistoryState(existingArray.filter((obj) => Object.keys(obj).length > 0));
  }, [searchParams]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // for api calling input search
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // useEffect to make curser write after text entered in home page
  useEffect(() => {
    console.log(inputRef.current?.defaultValue, "FFF");
    if (inputRef.current && inputRef.current.defaultValue) {
      const { defaultValue } = inputRef.current;
      console.log(defaultValue, "defff");
      inputRef.current.setSelectionRange(
        defaultValue.length,
        defaultValue.length
      );
    }
  }, [inputSearch]);
  return (
    <div>
      <SnakBar
        show={jobStatus === statusBar.error}
        message={error} // Pass your message here
        duration={3000}
      />
      <div className="search-space">
        <div className="search">
          <span className="fa fa-search" onClick={() => handleClickSearch()}>
            <img src={Search} alt="" />
          </span>
          <input
            ref={inputRef}
            defaultValue={inputSearch}
            autoFocus={searchParams.get("key") === "" ? false : true}
            placeholder="Search term"
            onFocus={() => setShowOptions(true)}
            onClick={() => setShowOptions(true)}
            onChange={handleChangeSearchInput}
          />
        </div>
        <AutocompleteMenue
          absoluteDivRef={absoluteDivRef}
          setShow={(st) => {
            setShowOptions(st);
          }}
          options={arrJobs.filter((job) =>
            job.attributes?.title
              ?.toLocaleLowerCase()
              .includes(inputSearch?.toLocaleLowerCase() || "")
          )}
          show={showOptions}
          onClick={(value) => {
            setShowOptions(false);
            navigate(`/job/${value.id}`);
          }}
          getOpLable={(op) => op?.attributes?.title || ""}
        />
      </div>
      <div className="job-list">
        <h2>All Jobs ()</h2>
        <div className="search-section">
          <div className="job-containers">
            {arrSearch.length > 0 ? (
              arrSearch.map((job, index) => (
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
              ))
            ) : (
              <div className="emptyState-position">
                <EmptyState
                  title="لا يوجد وظائف "
                  subTitle={`(${inputSearch}) لا توجد اي نتائج طبقا للبحث `}
                />
              </div>
            )}
          </div>
          <div className="search-history">
            <h3>Search History: </h3>
            <ul>
              {historyState.map((job, index) => (
                <NavLink
                  key={`${index + 1}`}
                  to={`/job/${job?.id}`}
                  className="navLink"
                >
                  <li className="list">{job?.value}</li>
                </NavLink>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
