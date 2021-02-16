import React from "react";
import {
  View,
  ImageBackground,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import ReactPlayer from "react-player";
import { Swipeable } from "react-swipeable";
import { gsap, Power2 } from "gsap";

import $ from "jquery";

import { projectDataFetch } from "../../../Data/ProjectSlice";
import HeaderBar from "../HeaderBar/HeaderBarMax";

import "./ProjectStyles.scss";

const Project: React.FC = () => {
  // Handle screen size detection and changes
  const [screenHeight, setScreenHeight] = React.useState(() => {
    let fetchedScreenHeight = Dimensions.get("window").height;
    return fetchedScreenHeight;
  });
  const [screenWidth, setScreenWidth] = React.useState(() => {
    let fetchedScreenWith = Dimensions.get("window").width;
    return fetchedScreenWith;
  });
  $(window).on("resize", () => {
    console.log({
      prevScreenHeight: screenHeight,
      prevScreenWidth: screenWidth,
    });
    setScreenHeight(() => {
      let fetchedScreenHeight = Dimensions.get("window").height;
      return fetchedScreenHeight;
    });
    setScreenWidth(() => {
      let fetchedScreenWith = Dimensions.get("window").width;
      return fetchedScreenWith;
    });
    console.log({
      updatedScreenHeight: screenHeight,
      updatedScreenWidth: screenWidth,
    });
  });

  // Handle screen size changes
  React.useEffect(() => {
    console.log({ detectedScreenHeightChange: screenHeight });
    let updatedHeightConfig = {
      ...styles,
      [`underlayerSupport`]: {
        ...styles[`underlayerSupport`],
        [`height`]: `${screenHeight / 100}px`,
      },
      [`headerBarForProjectSupport`]: {
        ...styles[`headerBarForProjectSupport`],
        [`height`]: `${(screenHeight / 100) * 5}px`,
      },
      projectDisplaySupportStyle: {
        ...styles.projectDisplaySupportStyle,
        height: `${(screenHeight / 100) * 95}px`,
      },
      reactPlayerView: {
        ...styles.reactPlayerView,
        width: `${screenWidth - 70}px`,
      },
      galleryViewSupport: {
        ...styles.galleryViewSupport,
        width: `${screenWidth - 70}px`,
      },
      journalExcerptViewSupport: {
        ...styles.journalExcerptViewSupport,
        width: `${screenWidth - 70}px`,
      },
    };
    setStyles(updatedHeightConfig);
  }, [screenHeight, screenWidth]);

  // Declare stylesheet for manipulation
  const [styles, setStyles] = React.useState({
    [`underlayer`]: `underlayer`,
    [`underlayerSupport`]: {
      [`width`]: `100%`,
      [`height`]: `${screenHeight}px`,
    },
    [`headerBarForProject`]: `headerBarForProject`,
    [`headerBarForProjectSupport`]: {
      [`width:`]: `100%`,
      [`height`]: `${(screenHeight / 100) * 5}px`,
    },
    projectDisplay: styles2.projectDisplay,
    projectDisplaySupportClass: `projectPageDisplaySupportClass`,
    projectDisplaySupportStyle: {
      width: "100%",
      height: `${(screenHeight / 100) * 95}px`,
    },
    projectNavigationView: styles2.projectNavigationView,
    reactPlayerView: { width: `${screenWidth - 70}px`, height: "100%" },
    reactPlayerViewClass: `reactPlayerViewClass`,
    galleryView: `galleryView`,
    galleryViewSupport: { width: `${screenWidth - 70}px`, height: "100%" },
    galleryImage: `galleryImage`,
    // galleryImageSupport: { width: "100%", height: "100%" },
    journalExcerptView: `journalExcerptView`,
    journalExcerptViewSupport: {
      width: `${screenWidth - 70}px`,
      height: "100%",
    },
    journalExcerptTitle: styles2.journalExcerptTitle,
    journalExcerptTitleSupport: `journalExcerptTitleSupport`,
    journalExcerptContent: styles2.journalExcerptContent,
    journalExcerptContentSupport: `journalExcerptContentSupport`,
    projectMediaNavigationView: styles2.mediaNavigationView,
    projectMediaNavigationJournalView:
      styles2.projectMediaNavigationJournalView,
    projectMediaNavigationMotionPictureView:
      styles2.projectMediaNavigationMotionPictureView,
    projectMediaNavigationGalleryView:
      styles2.projectMediaNavigationMotionPictureView,
    projectMediaNavigationJournalButton: `projectMediaNavigationJournalButton`,
    projectMediaNavigationJournalImage: `projectMediaNavigationJournalImage`,
    projectMediaNavigationJournalIndexNavigationView: `projectMediaNavigationJournalIndexNavigationView`,
    journalExcerptIndexInput: `journalExcerptIndexInput`,
    nextJournalExcerptNavigationButton: `nextJournalExcerptNavigationButton`,
    nextJournalExcerptNavigationButtonImage: `nextJournalExcerptNavigationButtonImage`,
    previousJournalExcerptNavigationButton: `previousJournalExcerptNavigationButton`,
    previousJournalExcerptNavigationButtonImage: `previousJournalExcerptNavigationButtonImage`,
    projectMediaNavigationMotionPictureButton: `projectMediaNavigationMotionPictureButton`,
    projectMediaNavigationMotionPictureImage: `projectMediaNavigationMotionPictureImage`,
    projectMediaNavigationMotionPictureIndexNavigationView: `projectMediaNavigationMotionPictureIndexNavigationView`,
    motionPictureIndexInput: `motionPictureIndexInput`,
    nextMotionPictureNavigationButton: `nextMotionPictureNavigationButton`,
    nextMotionPictureNavigationButtonImage: `nextMotionPictureNavigationButtonImage`,
    previousMotionPictureNavigationButton: `previousMotionPictureNavigationButton`,
    previousMotionPictureNavigationButtonImage: `previousMotionPictureNavigationButtonImage`,
    projectMediaNavigationGalleryButton: `projectMediaNavigationGalleryButton`,
    projectMediaNavigationGalleryImage: `projectMediaNavigationGalleryImage`,
    projectMediaNavigationGalleryIndexNavigationView: `projectMediaNavigationGalleryIndexNavigationView`,
    galleryIndexInput: `galleryIndexInput`,
    nextGalleryNavigationButton: `nextGalleryNavigationButton`,
    nextGalleryNavigationButtonImage: `nextGalleryNavigationButtonImage`,
    previousGalleryNavigationButton: `previousGalleryNavigationButton`,
    previousGalleryNavigationButtonImage: `previousGalleryNavigationButtonImage`,
    projectSelectionView: styles2.projectSelectionView,
    projectSelectionInput: `projectSelectionInput`,
    nextProjectNavigationButton: `nextProjectNavigationButton`,
    nextProjectNavigationButtonImage: `nextProjectNavigationButtonImage`,
    previousProjectNavigationButton: `previousProjectNavigationButton`,
    previousProjectNavigationButtonImage: `previousProjectNavigationButtonImage`,
  });

  // Declare element refs for gsap manipulation and other uses
  const mainDisplayRef = React.useRef<any>();
  const mainDisplaySupportClassRef = React.useRef<any>();
  const mainDisplaySupportStyleRef = React.useRef<any>();
  const projectNavigationViewRef = React.useRef<any>();
  const reactPlayerViewRef = React.useRef<any>();
  const galleryViewRef = React.useRef<any>();
  const galleryViewSupportRef = React.useRef<any>();
  const galleryImageRef = React.useRef<any>();
  // const galleryImageSupportRef = React.useRef<any>()
  const journalExcerptViewRef = React.useRef<any>();
  const journalExcerptViewSupportRef = React.useRef<any>();
  const journalExcerptTitleRef = React.useRef<any>();
  const journalExcerptTitleSupportRef = React.useRef<any>();
  const journalExcerptContentRef = React.useRef<any>();
  const journalExcerptContentSupportRef = React.useRef<any>();
  const projectMediaNavigationViewRef = React.useRef<any>();
  const projectMediaNavigationJournalViewRef = React.useRef<any>();
  const projectMediaNavigationMotionPictureViewRef = React.useRef<any>();
  const projectMediaNavigationGalleryViewRef = React.useRef<any>();
  const projectMediaNavigationJournalButtonRef = React.useRef<any>();
  const projectMediaNavigationJournalImageRef = React.useRef<any>();
  const projectMediaNavigationJournalIndexNavigationViewRef = React.useRef(
    null
  );
  const journalExcerptIndexInputRef = React.useRef<any>();
  const nextJournalExcerptNavigationButtonRef = React.useRef<any>();
  const nextJournalExcerptNavigationButtonImageRef = React.useRef<any>();
  const previousJournalExcerptNavigationButtonRef = React.useRef<any>();
  const previousJournalExcerptNavigationButtonImageRef = React.useRef<any>();
  const projectMediaNavigationMotionPictureButtonRef = React.useRef<any>();
  const projectMediaNavigationMotionPictureImageRef = React.useRef<any>();
  const projectMediaNavigationMotionPictureIndexNavigationViewRef = React.useRef(
    null
  );
  const motionPictureIndexInputRef = React.useRef<any>();
  const nextMotionPictureNavigationButtonRef = React.useRef<any>();
  const nextMotionPictureNavigationButtonImageRef = React.useRef<any>();
  const previousMotionPictureNavigationButtonRef = React.useRef<any>();
  const previousMotionPictureNavigationButtonImageRef = React.useRef<any>();
  const projectMediaNavigationGalleryButtonRef = React.useRef<any>();
  const projectMediaNavigationGalleryImageRef = React.useRef<any>();
  const projectMediaNavigationGalleryIndexNavigationViewRef = React.useRef(
    null
  );
  const galleryIndexInputRef = React.useRef<any>();
  const nextGalleryNavigationButtonRef = React.useRef<any>();
  const nextGalleryNavigationButtonImageRef = React.useRef<any>();
  const previousGalleryNavigationButtonRef = React.useRef<any>();
  const previousGalleryNavigationButtonImageRef = React.useRef<any>();
  const projectSelectionViewRef = React.useRef<any>();
  const projectSelectionInputRef = React.useRef<any>();
  const nextProjectNavigationButtonRef = React.useRef<any>();
  const nextProjectNavigationButtonImageRef = React.useRef<any>();
  const previousProjectNavigationButtonRef = React.useRef<any>();
  const previousProjectNavigationButtonImageRef = React.useRef<any>();

  // Declare variable holding authorization status
  const [authorizationStatus, setAuthorizationStatus] = React.useState(() => ({
    [`authorizedId`]: ``,
    [`personalAccess`]: ``,
  }));

  // Declare state for project data
  const [projectData, setProjectData] = React.useState({
    excerptIndex: 0,
    id: ``,
    title: ``,
    motionPictures: [{ title: ``, url: `` }],
    muralPhotos: [
      {
        middle: ``,
        topLeft: ``,
        bottomLeft: ``,
        topRight: ``,
        bottomRight: ``,
      },
    ],
    galleryPhotos: [{ title: ``, filename: `` }],
    journal: [{ title: ``, content: `` }],
  });

  // Declare variables holding current project media indexes
  // Declare variable tracking current journal excerpt
  const [journalExcerptIndex, setJournalExcerptIndex] = React.useState(0);
  // Declare variable tracking current motion picture
  const [currentMotionPicture, setCurrentMotionPicture] = React.useState(0);
  // Declare variable tracking current gallery photo index
  const [galleryIndex, setGalleryIndex] = React.useState(0);

  // Declare variables holding navigation index input values
  // Declare variable holding journal index input
  const [
    journalExcerptIndexInput,
    setJournalExcerptIndexInput,
  ] = React.useState(0);
  // Declare variable holding motion picture index input
  const [motionPictureIndexInput, setMotionPictureIndexInput] = React.useState(
    0
  );
  // Declare variable holding gallery index input
  const [galleryIndexInput, setGalleryIndexInput] = React.useState(0);
  // Declare variable holding project selection index input
  const [
    projectSelectionIndexInput,
    setProjectSelectionIndexInput,
  ] = React.useState(0);
  // Declare variable tracking search query activation
  const [isSearching, setIsSearching] = React.useState(false);

  // Declare variables for navigation data state
  // Declare variable holding journal navigation button image src
  const [
    journalNavigationButtonImage,
    setJournalNavigationButtonImage,
  ] = React.useState(() => {
    return `https://cdn4.iconfinder.com/data/icons/business-and-office-6-1/64/334-512.png`;
  });
  //Declare variable holding motion picture button image src
  const [
    motionPictureNavigationButtonImage,
    setMotionPictureNavigationButtonImage,
  ] = React.useState(
    `https://framesinaction.com/wp-content/uploads/2016/02/Old-Video-cam-icon.png`
  );
  //Declare variable holding journal button image src
  const [
    galleryNavigationButtonImage,
    setGalleryNavigationButtonImage,
  ] = React.useState(
    `http://icons.iconarchive.com/icons/alecive/flatwoken/512/Apps-Gallery-icon.png`
  );
  // Declare variable holding next journal excerpt button image src
  const [
    nextJournalExcerptNavigationButtonImage,
    setNextJournalExcerptButtonImage,
  ] = React.useState(
    `https://free.clipartof.com/13-Free-Vector-Illustration-Of-A-Right-Arrow-Icon.png`
  );
  // Declare variable holding previous journal excerpt button image src
  const [
    previousJournalExcerptNavigationButtonImage,
    setPreviousJournalExcerptButtonImage,
  ] = React.useState(
    `https://free.clipartof.com/13-Free-Vector-Illustration-Of-A-Right-Arrow-Icon.png`
  );
  // Declare variable holding next motion picture excerpt button image src
  const [
    nextMotionPictureNavigationButtonImage,
    setNextMotionPictureButtonImage,
  ] = React.useState(
    `https://free.clipartof.com/13-Free-Vector-Illustration-Of-A-Right-Arrow-Icon.png`
  );
  // Declare variable holding previous journal excerpt button image src
  const [
    previousMotionPictureNavigationButtonImage,
    setPreviousMotionPictureButtonImage,
  ] = React.useState(
    `https://free.clipartof.com/13-Free-Vector-Illustration-Of-A-Right-Arrow-Icon.png`
  );
  // Declare variable holding next gallery photo button image src
  const [
    nextGalleryNavigationButtonImage,
    setNextGalleryButtonImage,
  ] = React.useState(
    `https://free.clipartof.com/13-Free-Vector-Illustration-Of-A-Right-Arrow-Icon.png`
  );
  // Declare variable holding previous jgallery photo button image src
  const [
    previousGalleryNavigationButtonImage,
    setPreviousGaleryButtonImage,
  ] = React.useState(
    `https://free.clipartof.com/13-Free-Vector-Illustration-Of-A-Right-Arrow-Icon.png`
  );
  // Declare variable holding next project button image src
  const [
    nextProjectNavigationButtonImage,
    setNextProjectNavigationButtonImage,
  ] = React.useState(
    `https://free.clipartof.com/13-Free-Vector-Illustration-Of-A-Right-Arrow-Icon.png`
  );
  // Declare variable holding previous project image src
  const [
    previousProjectNavigationButtonImage,
    setPreviousProjectNavigationButtonImage,
  ] = React.useState(
    `https://free.clipartof.com/13-Free-Vector-Illustration-Of-A-Right-Arrow-Icon.png`
  );

  // Declare variable tracking current media view
  const [currentMediaView, setCurrentMediaView] = React.useState(
    `motionPicture`
  );
  // Declare view states for media
  // Declare view state for motion pictures
  const [motionPictureView, setMotionPictureView] = React.useState(<></>);
  // Declare view state for gallery
  const [galleryView, setGalleryView] = React.useState(<></>);
  // Declare view state for journal excerts
  const [journalExcerptView, setJournalExcerptView] = React.useState(<></>);

  // Declare variable handling current media view display
  const [mediaView, setMediaView] = React.useState(motionPictureView);

  // Declare variable handling project navigation view
  const [projectNavigationView, setProjectNavigationView] = React.useState(
    <></>
  );

  // Declare variable tracking initial project view setup
  const [
    initialProjectViewPrepared,
    setInitialProjectViewPrepared,
  ] = React.useState(false);
  // Declare variable tracking initial elements entrance
  const [initialElementsEntrance, setInitialElementsEntrance] = React.useState(
    false
  );
  // Handle initial data fetch
  React.useEffect(() => {
    let initiateProjectDataFetch = async () => {
      let updatedProjectData = await projectDataFetch(undefined);
      setProjectData(() => {
        return updatedProjectData.projectData.configured;
      });
    };
    initiateProjectDataFetch();
  }, []);

  // Handle view update for project data update
  React.useEffect(() => {
    setProjectNavigationView(
      <View ref={projectNavigationViewRef} style={styles.projectNavigationView}>
        <View
          ref={projectMediaNavigationViewRef}
          style={styles.projectMediaNavigationView}
        >
          <View
            ref={projectMediaNavigationJournalViewRef}
            style={styles.projectMediaNavigationJournalView}
          >
            <button
              ref={projectMediaNavigationJournalButtonRef}
              className={styles.projectMediaNavigationJournalButton}
              onClick={() => {
                setCurrentMediaView(`journalExcerpt`);
              }}
            >
              <img
                ref={projectMediaNavigationJournalImageRef}
                src={journalNavigationButtonImage}
                alt={`Journal Icon Button`}
                width={"100%"}
                height={"100%"}
                className={styles.projectMediaNavigationJournalImage}
              />
            </button>
            <div
              ref={projectMediaNavigationJournalIndexNavigationViewRef}
              className={
                styles.projectMediaNavigationJournalIndexNavigationView
              }
            >
              <button
                ref={nextJournalExcerptNavigationButtonRef}
                className={styles.nextJournalExcerptNavigationButton}
                onClick={() => {
                  if (
                    journalExcerptIndex < projectData.journal.length - 1 &&
                    journalExcerptIndex >= 0
                  ) {
                    setJournalExcerptIndex(journalExcerptIndex + 1);
                  } else {
                    setJournalExcerptIndex(0);
                  }
                }}
              >
                <img
                  ref={nextJournalExcerptNavigationButtonImageRef}
                  src={nextJournalExcerptNavigationButtonImage}
                  alt={`Navigation To Next Journal Excerpt`}
                  width={"100%"}
                  height={"100%"}
                  className={styles.nextJournalExcerptNavigationButtonImage}
                />
              </button>
              <input
                ref={journalExcerptIndexInputRef}
                type={"number"}
                placeholder={`${journalExcerptIndex + 1}`}
                width={"100%"}
                className={styles.journalExcerptIndexInput}
                onChange={(event) => {
                  let typedJournalExcerptIndex = Number(
                    event.currentTarget.value
                  );
                  console.log({ typedJournalExcerptIndex });
                  setJournalExcerptIndexInput(typedJournalExcerptIndex);
                }}
                onKeyPress={(event) => {
                  let capturedKeyEvent = event.key;
                  console.log({ capturedKeyEvent });
                  if (capturedKeyEvent === `Enter`) {
                    console.log(`Launching processes for Enter key`);
                    if (
                      journalExcerptIndexInput > 0 &&
                      journalExcerptIndexInput <= projectData.journal.length
                    ) {
                      console.log(`search query validated.!.`);
                      setJournalExcerptIndex(journalExcerptIndexInput - 1);
                    }
                    setIsSearching(true);
                  }
                }}
              />
              <button
                ref={previousJournalExcerptNavigationButtonRef}
                className={styles.previousJournalExcerptNavigationButton}
                onClick={() => {
                  if (
                    journalExcerptIndex > 0 &&
                    journalExcerptIndex <= projectData.journal.length - 1
                  ) {
                    setJournalExcerptIndex(journalExcerptIndex - 1);
                  } else {
                    setJournalExcerptIndex(projectData.journal.length - 1);
                  }
                }}
              >
                <img
                  ref={previousJournalExcerptNavigationButtonImageRef}
                  src={previousJournalExcerptNavigationButtonImage}
                  alt={`Navigation To Previous Journal Excerpt`}
                  width={"100%"}
                  height={"100%"}
                  className={styles.previousJournalExcerptNavigationButtonImage}
                />
              </button>
            </div>
          </View>
          <View
            ref={projectMediaNavigationMotionPictureViewRef}
            style={styles.projectMediaNavigationMotionPictureView}
          >
            <button
              ref={projectMediaNavigationMotionPictureButtonRef}
              className={styles.projectMediaNavigationMotionPictureButton}
              onClick={() => {
                setCurrentMediaView(`motionPicture`);
              }}
            >
              <img
                ref={projectMediaNavigationMotionPictureImageRef}
                src={motionPictureNavigationButtonImage}
                alt={`MotionPicture Icon Button`}
                width={"100%"}
                height={"100%"}
                className={styles.projectMediaNavigationMotionPictureImage}
              />
            </button>
            <div
              ref={projectMediaNavigationMotionPictureIndexNavigationViewRef}
              className={
                styles.projectMediaNavigationMotionPictureIndexNavigationView
              }
            >
              <button
                ref={nextMotionPictureNavigationButtonRef}
                className={styles.nextMotionPictureNavigationButton}
                onClick={() => {
                  if (
                    currentMotionPicture <
                      projectData.motionPictures.length - 1 &&
                    currentMotionPicture >= 0
                  ) {
                    setCurrentMotionPicture(currentMotionPicture + 1);
                  } else {
                    setCurrentMotionPicture(0);
                  }
                }}
              >
                <img
                  ref={nextMotionPictureNavigationButtonImageRef}
                  src={nextMotionPictureNavigationButtonImage}
                  alt={`Navigation For Next MotionPicture`}
                  width={"100%"}
                  height={"100%"}
                  className={styles.nextMotionPictureNavigationButtonImage}
                />
              </button>
              <input
                ref={motionPictureIndexInputRef}
                type={"number"}
                placeholder={`${currentMotionPicture + 1}`}
                width={"100%"}
                className={styles.motionPictureIndexInput}
                onChange={(event) => {
                  let typedMotionPictureIndex = Number(
                    event.currentTarget.value
                  );
                  console.log({ typedMotionPictureIndex });
                  setMotionPictureIndexInput(typedMotionPictureIndex);
                }}
                onKeyPress={(event) => {
                  let capturedKeyEvent = event.key;
                  console.log({ capturedKeyEvent });
                  if (capturedKeyEvent === `Enter`) {
                    console.log(`Launching processes for Enter key`);
                    if (
                      motionPictureIndexInput > 0 &&
                      motionPictureIndexInput <=
                        projectData.motionPictures.length
                    ) {
                      setCurrentMotionPicture(motionPictureIndexInput - 1);
                    }
                    setIsSearching(true);
                  }
                }}
              />
              <button
                ref={previousMotionPictureNavigationButtonRef}
                className={styles.previousMotionPictureNavigationButton}
                onClick={() => {
                  if (
                    currentMotionPicture > 0 &&
                    currentMotionPicture <=
                      projectData.motionPictures.length - 1
                  ) {
                    setCurrentMotionPicture(currentMotionPicture - 1);
                  } else {
                    setCurrentMotionPicture(
                      projectData.motionPictures.length - 1
                    );
                  }
                }}
              >
                <img
                  ref={previousMotionPictureNavigationButtonImageRef}
                  src={previousMotionPictureNavigationButtonImage}
                  alt={`Navigation For Previous MotionPicture`}
                  width={"100%"}
                  height={"100%"}
                  className={styles.previousMotionPictureNavigationButtonImage}
                />
              </button>
            </div>
          </View>
          <View
            ref={projectMediaNavigationGalleryViewRef}
            style={styles.projectMediaNavigationGalleryView}
          >
            <button
              ref={projectMediaNavigationGalleryButtonRef}
              className={styles.projectMediaNavigationGalleryButton}
              onClick={() => {
                setCurrentMediaView(`gallery`);
              }}
            >
              <img
                ref={projectMediaNavigationGalleryImageRef}
                src={galleryNavigationButtonImage}
                alt={`Gallery Icon Button`}
                width={"100%"}
                height={"100%"}
                className={styles.projectMediaNavigationGalleryImage}
              />
            </button>
            <div
              ref={projectMediaNavigationGalleryIndexNavigationViewRef}
              className={
                styles.projectMediaNavigationGalleryIndexNavigationView
              }
            >
              <button
                ref={nextGalleryNavigationButtonRef}
                className={styles.nextGalleryNavigationButton}
                onClick={() => {
                  if (
                    galleryIndex < projectData.galleryPhotos.length - 1 &&
                    galleryIndex >= 0
                  ) {
                    setGalleryIndex(galleryIndex + 1);
                  } else {
                    setGalleryIndex(0);
                  }
                }}
              >
                <img
                  ref={nextGalleryNavigationButtonImageRef}
                  src={nextGalleryNavigationButtonImage}
                  alt={`Navigation For Next Gallery`}
                  width={"100%"}
                  height={"100%"}
                  className={styles.nextGalleryNavigationButtonImage}
                />
              </button>
              <input
                ref={galleryIndexInputRef}
                type={"number"}
                placeholder={`${galleryIndex + 1}`}
                width={"100%"}
                className={styles.galleryIndexInput}
                onChange={(event) => {
                  let typedGalleryIndex = Number(event.currentTarget.value);
                  console.log({ typedGalleryIndex });
                  setGalleryIndexInput(typedGalleryIndex);
                }}
                onKeyPress={(event) => {
                  let capturedKeyEvent = event.key;
                  console.log({ capturedKeyEvent });
                  if (capturedKeyEvent === `Enter`) {
                    console.log(`Launching processes for Enter key`);
                    if (
                      galleryIndexInput > 0 &&
                      galleryIndexInput <= projectData.galleryPhotos.length
                    ) {
                      setGalleryIndex(galleryIndexInput - 1);
                    }
                    setIsSearching(true);
                  }
                }}
              />
              <button
                ref={previousGalleryNavigationButtonRef}
                className={styles.previousGalleryNavigationButton}
                onClick={() => {
                  if (
                    galleryIndex > 0 &&
                    galleryIndex <= projectData.galleryPhotos.length - 1
                  ) {
                    setGalleryIndex(galleryIndex - 1);
                  } else {
                    setGalleryIndex(projectData.galleryPhotos.length - 1);
                  }
                }}
              >
                <img
                  ref={previousGalleryNavigationButtonImageRef}
                  src={previousGalleryNavigationButtonImage}
                  alt={`Navigation For Previous Gallery`}
                  width={"100%"}
                  height={"100%"}
                  className={styles.previousGalleryNavigationButtonImage}
                />
              </button>
            </div>
          </View>
        </View>
        <View ref={projectSelectionViewRef} style={styles.projectSelectionView}>
          <button
            ref={nextProjectNavigationButtonRef}
            className={styles.nextProjectNavigationButton}
            onClick={async () => {
              console.log({ navigationCurrentProjectQuery: projectData });
              let nextProjectIndex = projectData.excerptIndex + 1;
              let nextProjectData = await projectDataFetch(nextProjectIndex);
              setProjectData(nextProjectData.projectData.configured);
              setJournalExcerptIndex(0);
              setCurrentMotionPicture(0);
              setGalleryIndex(0);
              console.log({ navigationUpdatedProjectQuery: projectData });
            }}
          >
            <img
              ref={nextProjectNavigationButtonImageRef}
              src={nextProjectNavigationButtonImage}
              alt={`Navigation To Next Project`}
              width={"100%"}
              height={"100%"}
              className={styles.nextProjectNavigationButtonImage}
            />
          </button>
          <input
            ref={projectSelectionInputRef}
            type={"text"}
            placeholder={`${projectData.excerptIndex + 1}`}
            width={"100%"}
            className={styles.projectSelectionInput}
            onChange={(event) => {
              let typedProjectSelectionIndex = Number(
                event.currentTarget.value
              );
              console.log({ typedProjectSelectionIndex });
              setProjectSelectionIndexInput(typedProjectSelectionIndex);
            }}
            onKeyPress={async (event) => {
              let capturedKeyEvent = event.key;
              console.log({ capturedKeyEvent });
              if (capturedKeyEvent === `Enter`) {
                event.preventDefault();
                console.log(`Launching processes for Enter key`);
                if (projectSelectionIndexInput > 0) {
                  let retrievedProjectData = await projectDataFetch(
                    projectSelectionIndexInput - 1
                  );
                  setProjectData(retrievedProjectData.projectData.configured);
                  setJournalExcerptIndex(0);
                  setCurrentMotionPicture(0);
                  setGalleryIndex(0);
                  setIsSearching(true);
                }
              }
            }}
          />
          <button
            ref={previousProjectNavigationButtonRef}
            className={styles.previousProjectNavigationButton}
            onClick={async () => {
              console.log({ navigationCurrentProjectQuery: projectData });
              let previousProjectIndex = projectData.excerptIndex - 1;
              let previousProjectData = await projectDataFetch(
                previousProjectIndex
              );
              setProjectData(previousProjectData.projectData.configured);
              setJournalExcerptIndex(0);
              setCurrentMotionPicture(0);
              setGalleryIndex(0);
              console.log({ navigationUpdatedProjectQuery: projectData });
            }}
          >
            <img
              ref={previousProjectNavigationButtonImageRef}
              src={previousProjectNavigationButtonImage}
              alt={`Navigation To Previous Project`}
              width={"100%"}
              height={"100%"}
              className={styles.previousProjectNavigationButtonImage}
            />
          </button>
        </View>
      </View>
    );
    setMotionPictureView(() => {
      return (
        <div
          ref={reactPlayerViewRef}
          className={styles.reactPlayerViewClass}
          style={styles.reactPlayerView}
        >
          <ReactPlayer
            width={"100%"}
            height={"100%"}
            controls
            url={
              projectData.motionPictures[currentMotionPicture] &&
              projectData.motionPictures[currentMotionPicture][`url`]
                ? projectData.motionPictures[currentMotionPicture].url
                : ``
            }
            config={{
              youtube: {
                playerVars: { start: 0 },
              },
            }}
            playing={false}
            onStart={() => {
              console.log(`React Player has loaded with message: Started`);
            }}
            onPlay={() => {}}
            onPause={() => {}}
            onEnded={() => {}}
            onProgress={() => {}}
          />
        </div>
      );
    });
    setGalleryView(
      <div
        ref={galleryViewRef}
        className={styles.galleryView}
        style={styles.galleryViewSupport}
      >
        <Swipeable
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
          onSwipedUp={() => {
            if (
              galleryIndex < projectData.galleryPhotos.length - 1 &&
              galleryIndex >= 0
            ) {
              setGalleryIndex(galleryIndex + 1);
            } else {
              setGalleryIndex(0);
            }
          }}
          onSwipedDown={() => {
            if (
              galleryIndex > 0 &&
              galleryIndex <= projectData.galleryPhotos.length - 1
            ) {
              setGalleryIndex(galleryIndex - 1);
            } else {
              setGalleryIndex(projectData.galleryPhotos.length - 1);
            }
          }}
        >
          <img
            ref={galleryImageRef}
            src={
              projectData.galleryPhotos[galleryIndex] &&
              projectData.galleryPhotos[galleryIndex][`filename`]
                ? projectData.galleryPhotos[galleryIndex].filename
                : `https://th.bing.com/th/id/R2f98696be371565497ac6a53715b6aa0?rik=krsDdNbN6QeWbA&riu=http%3a%2f%2ftrackthemissingchild.gov.in%2ftrackchild%2fimages%2fstate_portlet%2fno_data_found.png&ehk=MbF34AkbC0iPwR1QVdFqmsZHeBamiEBIjvULEXKyhzM%3d&risl=&pid=ImgRaw`
            }
            alt={`Gallery`}
            height={"100%"}
            width={"auto"}
            className={styles.galleryImage}
            /**
          style={styles.galleryImageSupport}
          
          onLoad={(event) => {
            let imageWidth = evenst.currentTarget.width;
            let imageHeight = event.currentTarget.height;
            console.log({ imageWidth, imageHeight });
            if (imageWidth > imageHeight) {
              setStyles({
                ...styles,
                galleryImageSupport: { width: "100%", height: "auto" },
              });
            } else if (imageHeight > imageWidth) {
              setStyles({
                ...styles,
                galleryImageSupport: { height: "100%", width: "auto" },
              });
            }
          }}
          */
          />
        </Swipeable>
      </div>
    );
    setJournalExcerptView(
      <div
        ref={journalExcerptViewRef}
        className={styles.journalExcerptView}
        style={styles.journalExcerptViewSupport}
      >
        <Swipeable
          style={{
            display: "column",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
          onSwipedLeft={() => {
            if (
              journalExcerptIndex < projectData.journal.length - 1 &&
              journalExcerptIndex >= 0
            ) {
              setJournalExcerptIndex(journalExcerptIndex + 1);
            } else {
              setJournalExcerptIndex(0);
            }
          }}
          onSwipedRight={() => {
            if (
              journalExcerptIndex > 0 &&
              journalExcerptIndex <= projectData.journal.length - 1
            ) {
              setJournalExcerptIndex(journalExcerptIndex - 1);
            } else {
              setJournalExcerptIndex(projectData.journal.length - 1);
            }
          }}
        >
          <div
            ref={journalExcerptTitleSupportRef}
            className={styles.journalExcerptTitleSupport}
          >
            <Text
              ref={journalExcerptTitleRef}
              style={styles.journalExcerptTitle}
            >
              {projectData.journal[journalExcerptIndex] &&
              projectData.journal[journalExcerptIndex][`title`]
                ? projectData.journal[journalExcerptIndex].title
                : `NO PASSAGE TITLE`}
            </Text>
          </div>
          <div
            ref={journalExcerptContentSupportRef}
            className={styles.journalExcerptContentSupport}
          >
            <Text
              ref={journalExcerptContentRef}
              style={styles.journalExcerptContent}
            >
              {projectData.journal[journalExcerptIndex] &&
              projectData.journal[journalExcerptIndex][`content`]
                ? projectData.journal[journalExcerptIndex].content
                : `NO PASSAGE CONTENT`}
            </Text>
          </div>
        </Swipeable>
      </div>
    );
    if (projectData.id !== ``) {
      setInitialProjectViewPrepared(true);
    }
    console.log({ ProjectStateData: projectData });
  }, [
    projectData,
    currentMotionPicture,
    motionPictureIndexInput,
    galleryIndex,
    galleryIndexInput,
    journalExcerptIndex,
    journalExcerptIndexInput,
    projectSelectionIndexInput,
    styles,
  ]);

  // Handle clearing input fields
  React.useEffect(() => {
    if (isSearching) {
      if (journalExcerptIndexInputRef) {
        journalExcerptIndexInputRef.current.value = ``;
      }
      if (motionPictureIndexInputRef) {
        motionPictureIndexInputRef.current.value = ``;
      }
      if (galleryIndexInputRef) {
        galleryIndexInputRef.current.value = ``;
      }
      if (projectSelectionInputRef) {
        projectSelectionInputRef.current.value = ``;
      }
      setIsSearching(false);
    }
  }, [isSearching]);

  // Handle current media view update for return view
  React.useEffect(() => {
    if (currentMediaView === `motionPicture`) {
      setMediaView(motionPictureView);
    } else if (currentMediaView === `gallery`) {
      setMediaView(galleryView);
    } else if (currentMediaView === `journalExcerpt`) {
      setMediaView(journalExcerptView);
    }
  }, [currentMediaView, motionPictureView, galleryView, journalExcerptView]);

  // Handle GSAP manipulations
  // Declare gsap timeline
  const tl = gsap.timeline();
  // Handle initial project view entrance
  React.useEffect(() => {
    if (initialElementsEntrance === false && initialProjectViewPrepared) {
      tl.to(projectNavigationViewRef.current, {
        duration: 4,
        top: 0,
        ease: Power2.easeOut,
      })
        .to(reactPlayerViewRef.current, {
          duration: 4,
          x: 0,
          ease: Power2.easeOut,
          delay: -1,
        })
        .to(reactPlayerViewRef.current, {
          zIndex: 0,
        });
      setInitialProjectViewPrepared(false);
      setInitialElementsEntrance(true);
    }
  }, [initialProjectViewPrepared]);

  // Handle function component return view
  return (
    <div className={styles[`underlayer`]} style={styles[`underlayerSupport`]}>
      <div
        className={styles[`headerBarForProject`]}
        style={styles[`headerBarForProjectSupport`]}
      >
        <HeaderBar
          authorizationStatusOpts={{
            authorizationStatus,
            setAuthorizationStatus,
          }}
        />
      </div>
      <div
        ref={mainDisplaySupportClassRef}
        className={styles.projectDisplaySupportClass}
        style={styles.projectDisplaySupportStyle}
      >
        <View ref={mainDisplayRef} style={styles.projectDisplay}>
          {mediaView}
          {projectNavigationView}
        </View>
      </div>
    </div>
  );
};

// Declare stylesheet for react-native components
const styles2 = StyleSheet.create({
  projectDisplay: {
    flexDirection: "row",
    margin: "auto",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  journalExcerptTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    color: "rgba(112, 128, 144, 0.5)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    borderBottomWidth: 0,
    textAlign: "center",
    textShadowColor: "green",
    textShadowRadius: 3,
    fontWeight: "800",
    fontSize: 35,
    fontFamily: "Consolas",
  },
  journalExcerptContent: {
    display: "flex",
    alignItems: "center",
    padding: 15,
    justifyContent: "center",
    color: "rgba(112, 128, 144, 0.5)",
    textAlign: "justify",
    textAlignVertical: "center",
    textShadowColor: "rgba(255, 22, 224, 1)",
    textShadowRadius: 1,
    fontFamily: "Consolas",
    fontWeight: "600",
    fontSize: 25,
    letterSpacing: 5,
    lineHeight: 65,
  },
  projectNavigationView: {
    position: "relative",
    top: "-500%",
    width: "70px",
    height: "100%",
    borderRightStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "rgba(231, 1, 200, 0.9)",
    borderLeftStyle: "solid",
    borderLeftWidth: 1,
    borderLeftColor: "rgba(231, 1, 200, 0.9)",
    backgroundColor: "rgba(0, 0, 0, 1)",
  },
  mediaNavigationView: {
    width: "100%",
    height: "auto",
  },
  projectMediaNavigationJournalView: {
    flexDirection: "row",
    borderTopStyle: "solid",
    borderTopWidth: 1,
    borderTopColor: "rgba(112, 128, 144, 0.5)",
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(112, 128, 144, 0.75)",
  },
  projectMediaNavigationMotionPictureView: {
    flexDirection: "row",
    borderTopStyle: "solid",
    borderTopWidth: 1,
    borderTopColor: "rgba(112, 128, 144, 0.5)",
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(112, 128, 144, 0.75)",
  },
  projectMediaNavigationGalleryView: {
    flexDirection: "row",
    borderTopStyle: "solid",
    borderTopWidth: 1,
    borderTopColor: "rgba(112, 128, 144, 0.5)",
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(112, 128, 144, 0.75)",
  },
  projectSelectionView: {
    position: "absolute",
    bottom: "0px",
    width: "100%",
    height: "auto",
  },
});

export default Project;

/**  Another window resize suggestion
 * <canvas
 * width={window.innerWidth}
 * height={window.innerHeight}
 * ></canvas
 * */
