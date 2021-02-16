import React from "react";
import { Dimensions } from "react-native";
import { useAuth0 } from "@auth0/auth0-react";
import $ from "jquery";

import {
  localUrl,
  dataBaseUrl,
  userBaseUrl,
} from "../../../../routes/routerBlock";

import "./HeaderBarStyles.scss";

interface HeaderBarInterface {
  authorizationStatusOpts: {
    authorizationStatus: {
      [`authorizedId`]: string;
      [`personalAccess`]: string;
    };
    setAuthorizationStatus: Function;
  };
}

const HeaderBar: React.FC<HeaderBarInterface> = ({
  authorizationStatusOpts,
}) => {
  // Deconstruct from Auth0 React hook
  const {
    loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    isLoading,
  } = useAuth0();
  // Deconstruct authorizationStatus from interface
  const {
    authorizationStatus,
    setAuthorizationStatus,
  } = authorizationStatusOpts;
  // Handle screen resize view updates
  const [screenHeight, setScreenHeight] = React.useState(() => {
    return Dimensions[`get`]("window")[`height`];
  });
  const [screenWidth, setScreenWidth] = React.useState(() => {
    return Dimensions[`get`]("window")[`width`];
  });

  $(window).on("resize", () => {
    setScreenHeight(() => {
      return Dimensions[`get`]("window")[`height`];
    });

    setScreenWidth(() => {
      return Dimensions[`get`]("window")[`width`];
    });
  });

  React.useEffect(() => {
    setStyles((prevStyles) => {
      return {
        ...prevStyles,
      };
    });
  }, [screenHeight]);

  //Declare variable holding styles
  const [styles, setStyles] = React.useState(() => {
    return {
      [`headerBarLoader`]: `headerBarLoader`,
      [`headerBarMainDisplay`]: `headerBarMainDisplay`,
      [`authorizationDisplay`]: `authorizationDisplay`,
      [`authorizationLoginButton`]: `authorizationLoginButton`,
      [`authorizationLogoutButton`]: `authorizationLogoutButton`,
      [`appNavigationDisplay`]: `appNavigationDisplay`,
      [`appNavigationToProjects`]: `appNavigationToProjects`,
      [`appNavigationToAPI`]: `appNavigationToAPI`,
      [`isLoggedIn`]: `isLoggedIn`,
    };
  });

  // Handle retrieval of user info and authorization statuses
  React.useEffect(() => {
    console[`log`]({ user });
    if (user && isAuthenticated) {
      let authorizedId = ``;
      if (user[`sub`][`includes`](`google-oauth2`)) {
        authorizedId = user[`sub`][`replace`](`google-oauth2|`, ``);
      } else if (user[`sub`][`includes`](`auth0`)) {
        authorizedId = user[`sub`][`replace`](`auth0|`, ``);
      }
      console[`log`]({ authorizedId });
      const fetchUserData = async () => {
        const fetchingUserData = await fetch(
          `${userBaseUrl}authorization/${authorizedId}/webApp/AnIdea`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          [`then`]((res) => {
            const json = res[`json`]();
            return json;
          })
          [`then`](async (data: { [`status`]: any }) => {
            console[`log`]({ data });
            if (data[`status`] === `user does not exist`) {
              const creatingNewUser = await fetch(`${userBaseUrl}newUser`, {
                method: `POST`,
                mode: `cors`,
                cache: `no-cache`,
                // credentials: `same-origin`,
                headers: { [`Content-Type`]: `application/json` },
                body: JSON[`stringify`]({
                  [`authorizedId`]: authorizedId,
                  [`userName`]: user[`name`],
                  [`userEmail`]: user[`email`],
                  [`webApp`]: `AnIdea`,
                  [`authorizedPersonalAccess`]: [`basic`],
                }),
              })
                [`then`]((res) => {
                  const json = res[`json`]();
                  console[`log`]({ testForNewUser: json });
                  return json;
                })
                [`then`]((data) => {
                  console[`log`]({
                    data: data[`authorizationStatuses`][`find`](
                      (aStatus: { [`webApp`]: string }) =>
                        aStatus[`webApp`] === `AnIdea`
                    )[`authorizedPersonalAccess`],
                  });
                  setAuthorizationStatus(() => ({
                    [`authorizedId`]: authorizedId,
                    [`personalAccess`]: data[`authorizationStatuses`][`find`](
                      (aStatus: { [`webApp`]: string }) =>
                        aStatus[`webApp`] === `AnIdea`
                    )[`authorizedPersonalAccess`][0],
                  }));
                });
            } else if (
              data[`status`] ===
              `user authorization for specified web app does not exist`
            ) {
              const updateUserAuthorization = await fetch(
                `${userBaseUrl}updateAuthorization/${authorizedId}`,
                {
                  method: `PUT`,
                  mode: `cors`,
                  cache: `no-cache`,
                  // credentials: `same-origin`,
                  headers: { [`Content-Type`]: `application/json` },
                  body: JSON[`stringify`]({
                    [`webApp`]: `AnIdea`,
                    [`authorizedPersonalAccess`]: [`basic`],
                    [`authorizedDataAccess`]: [],
                  }),
                }
              )
                [`then`]((res) => {
                  const json = res[`json`]();
                  console[`log`]({ testForUpdatedUserAuthorization: json });
                  return json;
                })
                [`then`]((data) => {
                  const foundWebAppAuthorizationStatus = data[`status`][
                    `authorizationStatuses`
                  ][`find`](
                    (aStatus: { [`webApp`]: string }) =>
                      aStatus[`webApp`] === `AnIdea`
                  );
                  console[`log`]({
                    foundWebAppAuthorizationStatus,
                  });
                  setAuthorizationStatus(() => ({
                    [`authorizedId`]: authorizedId,
                    [`personalAccess`]: foundWebAppAuthorizationStatus[
                      `authorizedPersonalAccess`
                    ][0],
                    [`authorizedDataIds`]: foundWebAppAuthorizationStatus[
                      `authorizedDataAccess`
                    ],
                  }));
                });
            } else {
              console[`log`](
                `user exists`,
                {
                  data,
                  authorizationStatus:
                    data[`status`][`authorizedPersonalAccess`],
                },
                {
                  [`authorizedId`]: authorizedId,
                  [`personalAccess`]: data[`status`][
                    `authorizedPersonalAccess`
                  ][0],
                }
              );
              setAuthorizationStatus(() => {
                return {
                  [`authorizedId`]: authorizedId,
                  [`personalAccess`]: data[`status`][
                    `authorizedPersonalAccess`
                  ][0],
                };
              });
            }
          });
      };
      fetchUserData();
    }
  }, [isAuthenticated]);

  // handle component return view
  if (isLoading)
    return <div className={styles[`headerBarLoader`]}>{`LOADING...`}</div>;
  return (
    <div className={styles[`headerBarMainDisplay`]}>
      <div className={styles[`appNavigationDisplay`]}>
        <div
          className={styles[`appNavigationToProjects`]}
          onClick={(event) => {
            window[`location`][`href`] = `${localUrl}project`;
          }}
        >{`PROJECTS`}</div>
        <div
          className={styles[`appNavigationToAPI`]}
          onClick={(event) => {
            window[`location`][`href`] = `${localUrl}api`;
          }}
        >{`API`}</div>
      </div>
      <div className={styles[`authorizationDisplay`]}>
        <div
          className={styles[`isLoggedIn`]}
        >{`Is logged in? ${isAuthenticated}`}</div>
        {isAuthenticated ? (
          <button
            className={styles[`authorizationLogoutButton`]}
            onClick={(event) => {
              logout({ [`returnTo`]: window[`location`][`href`] });
            }}
          >{`LOGOUT`}</button>
        ) : (
          <button
            className={styles[`authorizationLoginButton`]}
            onClick={(event) => {
              loginWithRedirect();
            }}
          >{`LOGIN`}</button>
        )}
      </div>
    </div>
  );
};

export default HeaderBar;
