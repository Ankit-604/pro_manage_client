import React from "react";
import { trimName } from "../utils";
import UserSearchExcerptStyles from "./styles/UserSearchExcerpt.module.css";

const UserSearchExcerpt = ({ user, onSelect }) => {
  return (
    <div className={UserSearchExcerptStyles.userSearchExcerpt__container}>
      <div className={UserSearchExcerptStyles.user}>
        <div className={UserSearchExcerptStyles.user__avatar}>
          {trimName(user.name)}
        </div>
        <div>{user.email}</div>
      </div>
    </div>
  );
};

export default UserSearchExcerpt;
