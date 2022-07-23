import React from "react";
import styled from "styled-components";
import { IoClose, IoSearch } from "react-icons/io5";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "react-click-outside-hook";
import { useEffect } from "react";
import { useRef } from "react";
import MoonLoader from "react-spinners/MoonLoader";
import { useDebounce } from "../../hooks/debounceHook";
import axios from "axios";
import { TvShow } from "../tvShow";

const SearchBarContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 34em;
  height: 3.8em;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0px 2px 12px 3px rgba(0, 0, 0, 0.14);
`;

const SearchInputContainer = styled.div`
  width: 100%;
  min-height: 4em;
  display: flex;
  align-items: center;
  position: relative;
  padding: 2px 15px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  font-size: 21px;
  color: #12112e;
  font-weight: 500;
  border-radius: 6px;
  background-color: transparent;

  &:focus {
    outline: none;
    &::placeholder {
      opacity: 0;
    }
  }

  &::placeholder {
    color: #bebebe;
    transition: all 250ms ease-in-out;
  }
`;

const SearchIcon = styled.span`
  color: #bebebe;
  font-size: 27px;
  margin-right: 10px;
  margin-top: 6px;
  vertical-align: middle;
`;

const CloseIcon = styled(motion.span)`
  color: #bebebe;
  font-size: 23px;
  vertical-align: middle;
  transition: all 200ms ease-in-out;
  cursor: pointer;

  &:hover {
    color: #dfdfdf;
  }
`;

const LineSeperator = styled.span`
  display: flex;
  min-width: 100%;
  min-height: 2px;
  background-color: #d8d8d878;
`;

const SearchContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1em;
  overflow-y: auto;
`;

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WarningMessage = styled.span`
  color: #a1a1a1;
  font-size: 14px;
  display: flex;
  align-self: center;
  justify-self: center;
`;

const containerVariants = {
  expanded: {
    height: "30em",
  },
  collapsed: {
    height: "3.8em",
  },
};

const containerTransition = { type: "spring", damping: 22, stiffness: 150 };

export function SearchBar() {
  const [isExpanded, setExpanded] = useState(false);
  const inputRef = useRef();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [tvShows, setTvShows] = useState([]);
  const [noTvShows, setNoTvShows] = useState(false);

  const changeHandler = (e) => {
    e.preventDefault();
    if (e.target.value.trim() === "") setNoTvShows(false);

    setSearchQuery(e.target.value);
  };

  const expandContainer = () => {
    setExpanded(true);
  };

  const prepareSearchQuery = (query) => {
    const url = `https://inquiry-ts.herokuapp.com/user/search-query?term=${query}`;

    return encodeURI(url);
  };

  const searchTvShow = async () => {
    if (!searchQuery || searchQuery.trim() === "") return;

    setLoading(true);
    setNoTvShows(false);

    console.log(prepareSearchQuery(searchQuery));

    const response = await axios.get(`https://inquiry-ts.herokuapp.com/user/search-query?term=${searchQuery}`, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2FkZWRVc2VyIjp7ImlkIjoxLCJlbWFpbCI6InZhdHNhbHAudGNzQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoidmF0c2FsMTkiLCJyb2xlIjoyLCJpc19hY3RpdmUiOnRydWUsInJlc2V0VG9rZW4iOm51bGwsInJlc2V0VG9rZW5FeHBpcmF0aW9uIjpudWxsLCJjcmVhdGVkQXQiOiIyMDIyLTA3LTExVDA1OjQ2OjA0LjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA3LTExVDA1OjQ2OjE5LjAwMFoifSwiaWF0IjoxNjU4NDk3MjEzLCJleHAiOjE2NTkxMDIwMTN9.U2ApxPDs-aDfNyez3leHp3F7JcMMQc0EIGLDhN7RHnw`
      }
    }).catch((err) => {
      console.log("Error: ", err);
    });
    console.log(response);

    if (response) {
      console.log("Response: ", response.data.data.rooms[0].title);
      if (response.data) setNoTvShows(true);
      setTvShows(response.data.data?.rooms);
    }
    setLoading(false);
  };
  useDebounce(searchQuery, 500, searchTvShow);

  return (
    <SearchBarContainer
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={containerVariants}
      transition={containerTransition}
    >
      <SearchInputContainer>
        <SearchIcon>
          <IoSearch />
        </SearchIcon>
        <SearchInput
          placeholder="Search for Series/Shows"
          onFocus={expandContainer}
          ref={inputRef}
          value={searchQuery}
          onChange={changeHandler}
        />
        <AnimatePresence>
          {isExpanded && (
            <CloseIcon
              key="close-icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <IoClose />
            </CloseIcon>
          )}
        </AnimatePresence>
      </SearchInputContainer>
      {isExpanded && <LineSeperator />}
      {isExpanded && (
        <SearchContent>
          {!isLoading && (
            <>
              {tvShows.map((object) => (
                <TvShow
                  name={object.title}
                />
              ))}
            </>
          )}
        </SearchContent>
      )}
    </SearchBarContainer>
  );
}
