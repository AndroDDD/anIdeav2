import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { store, dataBaseUrl } from "../../routes/routerBlock";

const ProjectSlice = createSlice({
  name: "projectData",
  initialState: {
    projectsId: [``],
    projectData: {
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
      galleryPhotos: [{ id: ``, title: ``, filename: `` }],
      journal: [{ title: ``, content: `` }],
    },
  },
  reducers: {
    setProjectsId: {
      reducer: (
        state,
        { payload }: PayloadAction<{ preppedIds: Array<string> }>
      ) => {
        state.projectsId = payload.preppedIds;
      },
      prepare: ({ preppedIds }: { preppedIds: Array<string> }) => ({
        payload: { preppedIds },
      }),
    },
    setProjectData: {
      reducer: (
        state,
        {
          payload,
        }: PayloadAction<{
          preppedData: {
            excerptIndex: number;
            id: string;
            title: string;
            motionPictures: Array<{ title: string; url: string }>;
            muralPhotos: Array<{
              middle: string;
              topLeft: string;
              bottomLeft: string;
              topRight: string;
              bottomRight: string;
            }>;
            galleryPhotos: Array<{
              id: string;
              title: string;
              filename: string;
            }>;
            journal: Array<{ title: string; content: string }>;
          };
        }>
      ) => {
        state.projectData = payload.preppedData;
      },
      prepare: ({
        preppedData,
      }: {
        preppedData: {
          excerptIndex: number;
          id: string;
          title: string;
          motionPictures: Array<{ title: string; url: string }>;
          muralPhotos: Array<{
            middle: string;
            topLeft: string;
            bottomLeft: string;
            topRight: string;
            bottomRight: string;
          }>;
          galleryPhotos: Array<{ id: string; title: string; filename: string }>;
          journal: Array<{ title: string; content: string }>;
        };
      }) => ({
        payload: {
          preppedData,
        },
      }),
    },
  },
});

export const { setProjectsId, setProjectData } = ProjectSlice.actions;

export const retrieveAllProjectsIds = async () => {
  let fetchingProjectsId = await fetch(dataBaseUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      const json = res.json();
      return json;
    })
    .then(
      (
        data: Array<{
          _id: string;
        }>
      ) => {
        const retrievedIds = data.map((project) => {
          return project._id;
        });
        store.dispatch(setProjectsId({ preppedIds: retrievedIds }));
        console.log({ retrievedIds });
        return retrievedIds;
      }
    );
  return fetchingProjectsId;
};

export const projectDataFetch = async (projectIndex?: number | string) => {
  let fetchedProjectsId =
    typeof projectIndex === "number" || typeof projectIndex === "undefined"
      ? await retrieveAllProjectsIds()
      : [``];
  let clarifiedProjectIndex = () => {
    if (
      typeof projectIndex === "number" ||
      typeof projectIndex === "undefined"
    ) {
      if (projectIndex) {
        if (projectIndex <= fetchedProjectsId.length - 1) {
          if (projectIndex < 0) {
            return 0;
          }
          return projectIndex;
        } else {
          return fetchedProjectsId.length - 1;
        }
      } else {
        return 0;
      }
    } else {
      return -1;
    }
  };

  let fetchedProject = await fetch(
    `${dataBaseUrl}${
      typeof projectIndex === "number" || typeof projectIndex === "undefined"
        ? fetchedProjectsId[clarifiedProjectIndex()]
        : projectIndex
    }`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => {
      const json = res.json();
      return json;
    })
    .then(
      (data: {
        dateAdded: string;
        ideaTitle: string;
        journal: Array<{
          _id: string;
          title: string;
          whatIsIt: string;
          content: string;
          references: { human: Array<string>; web: Array<string> };
          date: Date;
        }>;
        majorCatalogPhotos: Array<{
          _id: string;
          photoTitle: string;
          photoFilename: string;
          photoReferences: Array<string>;
          dateUploaded: Date;
        }>;
        miniCatalogPhotos: Array<{
          _id: string;
          middle: {
            photoName: string;
            photoFilename: string;
            photoOrientation: string;
            photoReferences: Array<string>;
            catalogIndex: number;
            dateUploaded: Date;
          };
          topLeft: {
            photoName: string;
            photoFilename: string;
            photoOrientation: string;
            photoReferences: Array<string>;
            catalogIndex: number;
            dateUploaded: Date;
          };
          bottomLeft: {
            photoName: string;
            photoFilename: string;
            photoOrientation: string;
            photoReferences: Array<string>;
            catalogIndex: number;
            dateUploaded: Date;
          };
          topRight: {
            photoName: string;
            photoFilename: string;
            photoOrientation: string;
            photoReferences: Array<string>;
            catalogIndex: number;
            dateUploaded: Date;
          };
          bottomRight: {
            photoName: string;
            photoFilename: string;
            photoOrientation: string;
            photoReferences: Array<string>;
            catalogIndex: number;
            dateUploaded: Date;
          };
        }>;
        motionPictures: Array<{
          dateUploaded: string;
          videoName: string;
          videoType: string;
          videoUrl: string;
          _id: string;
        }>;
        _id: string;
      }) => {
        let projectIndex = clarifiedProjectIndex();
        let projectId = data._id;
        let projectTitle = data.ideaTitle;
        let projectMotionPictures = data.motionPictures.map((mp) => {
          return { title: mp.videoName, url: mp.videoUrl };
        });
        let projectMuralPhotos = data.miniCatalogPhotos.map((minicp) => {
          let configgedPhotosUrl = {
            middle: `${dataBaseUrl}photos/${minicp.middle.photoFilename}`,
            topLeft: `${dataBaseUrl}photos/${minicp.topLeft.photoFilename}`,
            bottomLeft: `${dataBaseUrl}photos/${minicp.bottomLeft.photoFilename}`,
            topRight: `${dataBaseUrl}photos/${minicp.topRight.photoFilename}`,
            bottomRight: `${dataBaseUrl}photos/${minicp.bottomRight.photoFilename}`,
          };
          return configgedPhotosUrl;
        });
        let projectGalleryPhotos = data.majorCatalogPhotos.map((majorcp) => {
          let configgedPhotoData = {
            id: majorcp._id,
            title: majorcp.photoTitle,
            filename: `${dataBaseUrl}photos/${majorcp.photoFilename}`,
          };
          return configgedPhotoData;
        });
        let projectJournal = data.journal.map((excerpt) => {
          return { title: excerpt.title, content: excerpt.content };
        });
        let configgedProjectData = {
          excerptIndex: projectIndex,
          id: projectId,
          title: projectTitle,
          motionPictures: projectMotionPictures,
          muralPhotos: projectMuralPhotos,
          galleryPhotos: projectGalleryPhotos,
          journal: projectJournal,
        };

        store.dispatch(setProjectData({ preppedData: configgedProjectData }));

        console.log({
          retrievedProjectData: data,
          configgedProjectData: configgedProjectData,
        });

        return { fullData: data, configured: configgedProjectData };
      }
    );
  return {
    projectIds: fetchedProjectsId,
    projectData: fetchedProject,
  };
};

export default ProjectSlice.reducer;

export {};
