import React from "react";
import PropTypes from "prop-types";
import { trimName } from "../utils";
import UserSearchExcerptStyles from "./styles/UserSearchExcerpt.module.css";

const UserSearchExcerpt = ({ user, onSelect }) => {
  return (
    <div
      className={UserSearchExcerptStyles.userSearchExcerpt__container}
      onClick={() => onSelect(user)}
    >
      <div className={UserSearchExcerptStyles.user}>
        <div className={UserSearchExcerptStyles.user__avatar}>
          {trimName(user.name)}
        </div>
        <div>{user.email}</div>
      </div>
    </div>
  );
};

UserSearchExcerpt.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default UserSearchExcerpt;
