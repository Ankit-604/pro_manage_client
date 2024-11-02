import React from "react";
import PropTypes from "prop-types";
import { trimName } from "../utils";
import UserSearchStyles from "./styles/UserSearch.module.css";

const UserSearchExcerpt = ({ user, onSelect }) => {
  return (
    <div
      className={UserSearchStyles.userSearchContainer}
      onClick={() => onSelect(user)}
    >
      <div className={UserSearchStyles.user}>
        <div className={UserSearchStyles.userAvatar}>{trimName(user.name)}</div>
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
