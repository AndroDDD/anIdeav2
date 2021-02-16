import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useFormik } from "formik";
import { useAuth0 } from "@auth0/auth0-react";
import * as yup from "yup";
import ReactPlayer from "react-player";

import { v4 } from "uuid";
import $ from "jquery";

import HeaderBar from "../HeaderBar/HeaderBarMax";
import {
  projectDataFetch,
  retrieveAllProjectsIds,
} from "../../../Data/ProjectSlice";

import "./APIStyles.scss";
import {
  dataBaseUrl,
  localUrl,
  userBaseUrl,
  store,
} from "../../../../routes/routerBlock";

interface FormConfigurationInterface {
  styles: any;
  customInitialFormValues: {
    initialFormValues: any;
    setInitialFormValues: Function;
  };
  ids: {
    mediaDataIds: {
      current: Record<string, any> & {
        video: string | number;
        galleryPhoto: string | number;
        passage: string | number;
      };
    };
    setMediaDataIds: React.Dispatch<
      React.SetStateAction<{
        current: {
          video: string | number;
          galleryPhoto: string | number;
          passage: string | number;
        };
      }>
    >;
  };
  formFacade: {
    initialInputs: Array<{ name: string; inputType: string }>;
    mediaInputsNav: Array<{ mediaType: string; buttonText: string }>;
    mediaMiniFormInputs: Array<{
      mediaType: string;
      addButtonText: string;
      inputsOpts: Array<{
        key: string;
        typeOfInput: string;
        childrenElements?: Array<any>;
        initialValue?: any;
      }>;
      inputsDeletionCallback: Function;
    }>;
  };
  formPreviewDataOpts: {
    formPreviewData: {
      stored: any;
      current: { type: string; data: any };
    };
    setFormPreviewData: React.Dispatch<
      React.SetStateAction<{
        stored: any;
        current: {
          type: string;
          data: any;
        };
      }>
    >;
  };
  customFormSchema: {
    validSchema: any;
    setValidSchema: Function;
  };
  storedRefs: Record<string, React.MutableRefObject<any>>;
  dataForForm?: any;
}

interface genericObject extends Record<string, any> {}

const FormConfiguration: React.FC<FormConfigurationInterface> = ({
  styles,
  customInitialFormValues,
  ids,
  formFacade,
  formPreviewDataOpts,
  customFormSchema,
  storedRefs,
  dataForForm,
}) => {
  // Destructure incoming props
  const { initialFormValues } = customInitialFormValues;
  const { validSchema, setValidSchema } = customFormSchema;
  const { mediaDataIds, setMediaDataIds } = ids;
  const { initialInputs, mediaInputsNav, mediaMiniFormInputs } = formFacade;
  const { formPreviewData, setFormPreviewData } = formPreviewDataOpts;

  const [extraHeaderOptions, setExtraHeaderOptions] = React.useState(() => {
    return <></>;
  });

  // Handle Form Submission
  const handleFormSubmission = (values: genericObject) => {
    console.log({ values, validSchema });
    setFormPreviewData((previousFormPreviewData) => {
      return {
        ...previousFormPreviewData,
        current: {
          type: "allNewData",
          data: values,
        },
      };
    });
    formikConf.resetForm(formikConf);
  };

  // Generate new form input
  const newFormElement = (
    whatType: string,
    mediaType: string,
    mediaKeyRef: string,
    dataKeyRefId: string | number | undefined,
    classNameForStyle: string,
    childElements?: Array<any>,
    dataConfigObject?: object,
    initialInputValue?: any,
    inputsDeletionCallBack?: Function
  ) => {
    const generatedSubId = v4();

    const createNewInputLabelId = () => {
      if (whatType === `textInputWithSubIndex`) {
        return `${mediaType}-${mediaKeyRef}-label-id-${dataKeyRefId}-subId-${generatedSubId}`;
      }

      if (mediaKeyRef === `data`) {
        return `${mediaType}-${mediaKeyRef}-label-id-${dataKeyRefId}`;
      } else {
        return `${mediaType}-${mediaKeyRef}-label-id-${dataKeyRefId}`;
      }
    };

    const createNewInputLabelText = () => {
      if (whatType === `textInputWithSubIndex`) {
        const clarifyingText = () => {
          return `${mediaKeyRef}:${String(generatedSubId).slice(0, 6)}`;
        };
        const clarifiedText = clarifyingText();
        return clarifiedText;
      }
      if (mediaKeyRef === `data`) {
        const clarifyingText = () => {
          return `${mediaType}:${String(dataKeyRefId).slice(0, 6)}`;
        };
        const clarifiedText = clarifyingText();
        return clarifiedText;
      } else {
        return mediaKeyRef;
      }
    };

    let newFormElementLabel = document.createElement("div");
    newFormElementLabel.id = createNewInputLabelId();
    newFormElementLabel.className = `${classNameForStyle}-label`;
    newFormElementLabel.innerHTML = createNewInputLabelText();

    let newFormElementsRemoveButton = document.createElement("div");

    let newFormElementsContainer = document.createElement("div");

    let newFormElement: any;

    if (whatType === `textInput`) {
      newFormElementsContainer.className = `${classNameForStyle}-text-input-container`;
      newFormElementsRemoveButton.className = `${classNameForStyle}-text-input-remove-button`;

      let newFormInputElement = document.createElement("input");
      newFormInputElement.id = `${mediaType}s.${mediaType}Data-${dataKeyRefId}.${mediaKeyRef}`;
      newFormInputElement.name = `${mediaType}s.${mediaType}Data-${dataKeyRefId}.${mediaKeyRef}`;
      newFormInputElement.type = `text`;
      newFormInputElement.className = `${classNameForStyle}-text-input`;

      newFormInputElement.onblur = (event) => {
        formikConf.handleBlur(event);
      };

      newFormInputElement.onchange = (event) => {
        console.log({ event });
        const eventTyped = (event as unknown) as React.ChangeEvent<HTMLInputElement>;
        formikConf.handleChange(event);
        formikConf.handleBlur(event);
        setFormPreviewData((previousFormPreviewData: any) => {
          return {
            ...previousFormPreviewData,
            current: {
              ...previousFormPreviewData[`current`],
              data: {
                ...previousFormPreviewData[`current`][`data`],
                [mediaKeyRef]: eventTyped.target.value,
              },
            },
          };
        });
      };
      if (initialInputValue) {
        newFormInputElement.value = initialInputValue;
      }

      setValidSchema((prevYupSchema: any) => {
        let updatedSchema = createYupSchema({
          schema: prevYupSchema,
          config: {
            id: {
              mediaType: `${mediaType}s`,
              dataRefId: `${mediaType}Data-${dataKeyRefId}`,
              inputKeyRef: `${mediaKeyRef}`,
            },
            validationType: `string`,
            validations: [
              { type: `required`, params: `Please enter ${mediaKeyRef}` },
            ],
          },
        });
        return updatedSchema;
      });

      newFormElement = newFormInputElement;
    } else if (whatType === `textInputWithSubIndex`) {
      newFormElementsContainer.className = `${classNameForStyle}-text-input-container`;
      newFormElementsContainer.id = `${mediaType}-${mediaKeyRef}-${dataKeyRefId}-subId-${generatedSubId}`;
      newFormElementsRemoveButton.className = `${classNameForStyle}-text-input-remove-button`;

      let newFormInputElement = document.createElement("input");
      newFormInputElement.id = `${mediaType}s.${mediaType}Data-${dataKeyRefId}.${mediaKeyRef}-${generatedSubId}`;
      newFormInputElement.name = `${mediaType}s.${mediaType}Data-${dataKeyRefId}.${mediaKeyRef}-${generatedSubId}`;
      newFormInputElement.type = `text`;
      newFormInputElement.className = `${classNameForStyle}-text-input`;

      newFormInputElement.onblur = (event) => {
        formikConf.handleBlur(event);
      };
      newFormInputElement.onchange = (event) => {
        let eventTyped = (event as unknown) as React.ChangeEvent<HTMLInputElement>;
        let extractedValue = eventTyped.target.value;
        let allRetrievedSubInputs = (eventTyped.target.parentNode?.parentNode
          ?.childNodes as unknown) as Array<HTMLDivElement>;
        let allRetrievedSubInputsConverted = Array.prototype.slice.call(
          allRetrievedSubInputs
        );

        let retrievedElementIndex = allRetrievedSubInputsConverted.findIndex(
          (element) =>
            element.id ===
            `${mediaType}-${mediaKeyRef}-${dataKeyRefId}-subId-${generatedSubId}`
        );

        let retrievedPreviousFormValuesForSubInputs: Array<string> = [];
        for (let i = 0; i < allRetrievedSubInputsConverted.length; i++) {
          retrievedPreviousFormValuesForSubInputs.push(
            allRetrievedSubInputsConverted[i].childNodes[2][`value`]
          );
        }

        if (retrievedElementIndex && retrievedElementIndex > 0) {
          retrievedPreviousFormValuesForSubInputs.splice(
            retrievedElementIndex,
            1,
            extractedValue
          );
        } else if (retrievedElementIndex === 0) {
          if (allRetrievedSubInputsConverted.length > 1) {
            retrievedPreviousFormValuesForSubInputs.shift();
            retrievedPreviousFormValuesForSubInputs.unshift(extractedValue);
          } else {
            retrievedPreviousFormValuesForSubInputs = [`${extractedValue}`];
          }
        }

        formikConf.setFieldValue(
          `${mediaType}s.${mediaType}Data-${dataKeyRefId}.${mediaKeyRef}s`,
          retrievedPreviousFormValuesForSubInputs
        );

        setFormPreviewData((previousFormPreviewData: any) => {
          return {
            ...previousFormPreviewData,
            current: {
              ...previousFormPreviewData[`current`],
              data: {
                ...previousFormPreviewData[`current`][`data`],
                [`${mediaKeyRef}s`]: retrievedPreviousFormValuesForSubInputs,
              },
            },
          };
        });
      };

      if (initialInputValue) {
        newFormInputElement.value = initialInputValue;
      }

      newFormElement = newFormInputElement;
    } else if (whatType === `listInput`) {
      newFormElementsContainer.className = `${classNameForStyle}-list-input-container`;
      newFormElementsContainer.id = `${mediaType}-${mediaKeyRef}-${dataKeyRefId}-subId-${generatedSubId}`;
      newFormElementsRemoveButton.className = `${classNameForStyle}-list-remove-button`;

      let newFormListElement = document.createElement("li");
      newFormListElement.id = `${mediaType}-${mediaKeyRef}-input-id-${dataKeyRefId}-subId-${generatedSubId}`;
      newFormListElement.className = `${classNameForStyle}-list`;

      if (childElements) {
        for (let i = 0; i < childElements.length; i++) {
          let newFormListInputElement = document.createElement("input");
          newFormListInputElement.type = `radio`;
          newFormListInputElement.className = `${classNameForStyle}-list-input-radio`;
          newFormListInputElement.name = `${mediaType}s.${mediaType}Data-${dataKeyRefId}.${mediaKeyRef}`;
          newFormListInputElement.value = `${childElements[i]}`;
          newFormListInputElement.onchange = (event) => {
            const eventTyped = (event as unknown) as React.ChangeEvent<HTMLInputElement>;
            formikConf.handleChange(event);
            formikConf.handleBlur(event);
            setFormPreviewData((previousFormPreviewData: any) => {
              return {
                ...previousFormPreviewData,
                current: {
                  ...previousFormPreviewData[`current`],
                  data: {
                    ...previousFormPreviewData[`current`][`data`],
                    [mediaKeyRef]: eventTyped.target.value,
                  },
                },
              };
            });
          };

          if (initialInputValue && childElements[i] === initialInputValue) {
            newFormListInputElement.checked = true;
          }

          let newFormListInputElementLabel = document.createElement("div");
          newFormListInputElementLabel.className = `${classNameForStyle}-list-input-label`;
          newFormListInputElementLabel.innerHTML = `${childElements[i]}`;

          let newFormListInputElementContainer = document.createElement("div");
          newFormListInputElementContainer.className = `${classNameForStyle}-list-input-container`;
          newFormListInputElementContainer.appendChild(newFormListInputElement);
          newFormListInputElementContainer.appendChild(
            newFormListInputElementLabel
          );

          newFormListElement.appendChild(newFormListInputElementContainer);
        }
      }

      setValidSchema((prevYupSchema: any) => {
        let updatedSchema = createYupSchema({
          schema: prevYupSchema,
          config: {
            id: {
              mediaType: `${mediaType}s`,
              dataRefId: `${mediaType}Data-${dataKeyRefId}`,
              inputKeyRef: `${mediaKeyRef}`,
            },
            validationType: `string`,
            validations: [
              { type: `required`, params: `Please enter ${mediaKeyRef}` },
            ],
          },
        });
        return updatedSchema;
      });

      newFormElement = newFormListElement;
    } else if (whatType === `fileInput`) {
      console.log(`file input created`);
      newFormElementsContainer.className = `${classNameForStyle}-file-input-container`;
      newFormElementsContainer.id = `${mediaType}-${mediaKeyRef}-${dataKeyRefId}`;
      newFormElementsRemoveButton.className = `${classNameForStyle}-file-input-remove-button`;

      let newFormFileInputElement = document.createElement("input");
      newFormFileInputElement.type = "file";
      newFormFileInputElement.name = `${mediaType}s.${mediaType}Data-${dataKeyRefId}.${mediaKeyRef}`;
      newFormFileInputElement.className = `${classNameForStyle}-file-input`;
      newFormFileInputElement.accept = `image/*`;
      newFormFileInputElement.onchange = (event) => {
        const eventTyped = (event as unknown) as React.ChangeEvent<HTMLInputElement>;
        console[`log`]({
          event,
          eventTyped,
          inputFileData: eventTyped[`target`][`files`],
        });
        if (
          eventTyped[`target`][`files`] &&
          eventTyped[`target`][`files`][`length`] > 0
        ) {
          let fileToURL = eventTyped[`target`][`files`]
            ? URL.createObjectURL(eventTyped[`target`][`files`][0])
            : undefined;
          console[`log`]({ fileToURL });

          formikConf.setFieldValue(
            `${mediaType}s.${mediaType}Data-${dataKeyRefId}.${mediaKeyRef}`,
            fileToURL
          );
          formikConf.handleBlur(event);
          setFormPreviewData((previousFormPreviewData: any) => {
            return {
              ...previousFormPreviewData,
              current: {
                ...previousFormPreviewData[`current`],
                data: {
                  ...previousFormPreviewData[`current`][`data`],
                  [mediaKeyRef]: fileToURL,
                },
              },
            };
          });
        } else {
          formikConf.setFieldValue(
            `${mediaType}s.${mediaType}Data-${dataKeyRefId}.${mediaKeyRef}`,
            ``
          );
          formikConf.handleBlur(event);
          setFormPreviewData((previousFormPreviewData: any) => {
            return {
              ...previousFormPreviewData,
              current: {
                ...previousFormPreviewData[`current`],
                data: {
                  ...previousFormPreviewData[`current`][`data`],
                  [mediaKeyRef]: ``,
                },
              },
            };
          });
        }
      };

      if (initialInputValue) {
        newFormFileInputElement.defaultValue = initialInputValue;
      }

      setValidSchema((prevYupSchema: any) => {
        let updatedSchema = createYupSchema({
          schema: prevYupSchema,
          config: {
            id: {
              mediaType: `${mediaType}s`,
              dataRefId: `${mediaType}Data-${dataKeyRefId}`,
              inputKeyRef: `${mediaKeyRef}`,
            },
            validationType: `string`,
            validations: [
              { type: `required`, params: `Please enter ${mediaKeyRef}` },
            ],
          },
        });
        return updatedSchema;
      });

      newFormElement = newFormFileInputElement;
    } else if (whatType === `inputsContainer`) {
      newFormElementsContainer.className = `${classNameForStyle}-outter-inputs-container`;
      newFormElementsContainer.id = `${mediaType}Data-${dataKeyRefId}`;
      newFormElementsContainer.onmousedown = (event) => {
        console.log({ focusEvent: event, storedRefs });
        const allInputNodesRetrieved = (storedRefs[`${mediaType}sInputViewRef`][
          `current`
        ][`childNodes`] as unknown) as Array<HTMLDivElement>;
        for (let g = 0; g < allInputNodesRetrieved[`length`]; g++) {
          if (
            allInputNodesRetrieved[g][`id`][`includes`](
              `${mediaType}Data-${dataKeyRefId}`
            )
          ) {
            const inputsNodesRetrieved =
              allInputNodesRetrieved[g][`childNodes`][2][`childNodes`];
            console.log({ inputsNodesRetrieved });
            if (dataConfigObject) {
              let dataConfig: any = { ...dataConfigObject };
              let dataConfigKeys: Array<string> = Object.keys(dataConfig);
              console.log({ inputsNodesRetrieved });
              if (inputsNodesRetrieved && inputsNodesRetrieved[`length`] >= 0) {
                for (let i = 0; i < inputsNodesRetrieved[`length`]; i++) {
                  if (
                    inputsNodesRetrieved[i][`childNodes`][2][`nodeName`] ===
                    `INPUT`
                  ) {
                    const elementTyped = (inputsNodesRetrieved[i][
                      `childNodes`
                    ][2] as unknown) as HTMLInputElement;
                    const nodeName = elementTyped[`name`];
                    const foundMatchedIndex = dataConfigKeys[
                      `findIndex`
                    ]((key) => nodeName[`includes`](key));
                    if (elementTyped[`type`] === `text`) {
                      dataConfig = {
                        ...dataConfig,
                        [dataConfigKeys[foundMatchedIndex]]:
                          elementTyped[`value`],
                      };
                    } else if (elementTyped[`type`] === `file`) {
                      if (elementTyped[`files`]) {
                        if (elementTyped[`files`][`length`] === 1) {
                          const fileToURL = URL.createObjectURL(
                            elementTyped[`files`][0]
                          );
                          dataConfig = {
                            ...dataConfig,
                            [dataConfigKeys[foundMatchedIndex]]: fileToURL,
                          };
                        } else if (elementTyped[`files`][`length`] > 1) {
                          let filesToURLs: Array<string> = [];
                          for (let f = 0; f < filesToURLs[`length`]; f++) {
                            filesToURLs.push(
                              URL.createObjectURL(elementTyped[`files`][f])
                            );
                          }
                          dataConfig = {
                            ...dataConfig,
                            [dataConfigKeys[foundMatchedIndex]]: filesToURLs,
                          };
                        }
                      } else {
                        dataConfig = {
                          ...dataConfig,
                          [dataConfigKeys[foundMatchedIndex]]: undefined,
                        };
                      }
                    }
                  } else if (
                    inputsNodesRetrieved[i][`childNodes`][2][`nodeName`] ===
                    `LI`
                  ) {
                    const elementTyped = (inputsNodesRetrieved[i][
                      `childNodes`
                    ][2] as unknown) as HTMLLIElement;
                    console.log({ elementTyped });
                    // const nodeName = elementTyped[`name`];
                    // const foundMatchedIndex = dataConfigKeys[`findIndex`]((key) =>
                    //  nodeName[`includes`](key)
                    // );
                    // console.log({ foundMatchedIndex });
                    let verifiedValues: Array<any> = [];
                    for (
                      let x = 0;
                      x < elementTyped[`childNodes`][`length`];
                      x++
                    ) {
                      let inputElementTyped = (elementTyped[`childNodes`][x][
                        `childNodes`
                      ][0] as unknown) as HTMLInputElement;
                      if (
                        inputElementTyped[`type`] === `checkbox` &&
                        inputElementTyped[`checked`]
                      ) {
                        verifiedValues.push(inputElementTyped[`value`]);
                      }
                    }
                    dataConfig = {
                      ...dataConfig,
                      [dataConfigKeys[i]]:
                        verifiedValues[`length`] === 1
                          ? verifiedValues[0]
                          : verifiedValues,
                    };
                  } else if (
                    inputsNodesRetrieved[i][`childNodes`][3][`nodeName`] ===
                    `DIV`
                  ) {
                    const elementTyped = (inputsNodesRetrieved[i][
                      `childNodes`
                    ][3] as unknown) as HTMLDivElement;
                    console.log({ elementTyped });
                    const nodeId = elementTyped[`id`];
                    const foundMatchedIndex = dataConfigKeys[
                      `findIndex`
                    ]((key) => nodeId[`includes`](key));
                    console.log({ foundMatchedIndex });
                    let inputsValuesHold = [];
                    const retrievedInputsContainers =
                      inputsNodesRetrieved[i][`childNodes`][3][`childNodes`];
                    for (let o = 0; o < retrievedInputsContainers.length; o++) {
                      let retrievedInputNode = (retrievedInputsContainers[o][
                        `childNodes`
                      ][2] as unknown) as HTMLInputElement;
                      let retrievedInputValue = retrievedInputNode[`value`];
                      inputsValuesHold.push(retrievedInputValue);
                    }
                    dataConfig = {
                      ...dataConfig,
                      [dataConfigKeys[foundMatchedIndex]]: inputsValuesHold,
                    };
                  }
                }
              }
              handleCurrentMediaInputsSelectedStyle(
                allInputNodesRetrieved,
                `${mediaType}Data-${dataKeyRefId}`,
                mediaType
              );

              setMediaDataIds((previousMediaDataIds: any) => {
                return {
                  ...previousMediaDataIds,
                  [`current`]: {
                    ...previousMediaDataIds[`current`],
                    [`${mediaType}`]: `${mediaType}Data-${dataKeyRefId}`,
                  },
                };
              });

              setFormPreviewData((previousFormPreviewData) => {
                return {
                  ...previousFormPreviewData,
                  current: {
                    type: mediaType,
                    data: dataConfig,
                  },
                };
              });
            }
          }
        }
      };

      newFormElementsRemoveButton.className = `${classNameForStyle}-inputs-remove-button`;

      let newFormInputsContainerElement = document.createElement("div");
      newFormInputsContainerElement.id = `${mediaType}-${mediaKeyRef}-inputs-container-id-${dataKeyRefId}`;

      newFormInputsContainerElement.className = `${classNameForStyle}-inner-inputs-container`;

      if (childElements) {
        for (let i = 0; i < childElements.length; i++) {
          newFormInputsContainerElement.appendChild(childElements[i]);
        }
      }

      newFormElement = newFormInputsContainerElement;
    } else {
      newFormElementsContainer.className = `${classNameForStyle}-unknown-element-container`;

      let newFormUnknownElement = document.createElement("div");
      newFormUnknownElement.id = `${mediaType}:${mediaKeyRef}:unknown-element:id:${dataKeyRefId}`;

      newFormUnknownElement.className = `${classNameForStyle}-unknown-element`;

      newFormElement = newFormUnknownElement;
    }

    if (mediaKeyRef === `data`) {
      newFormElementsRemoveButton.innerHTML = `-`;
      newFormElementsRemoveButton.onclick = (event) => {
        let eventTyped = (event as unknown) as React.ChangeEvent<HTMLInputElement>;
        console.log({ eventTyped: eventTyped[`target`][`parentNode`] });

        formikConf.setFieldValue(
          `${mediaType}s.${mediaType}Data-${dataKeyRefId}`,
          undefined
        );

        setValidSchema((prevSchema: any) => {
          let updatedSchema = { ...prevSchema };
          let updatedSchemaFields = updatedSchema[`fields`];
          delete updatedSchemaFields[`${mediaType}s`][`fields`][
            `${mediaType}Data-${dataKeyRefId}`
          ];
          console.log({ updatedSchemaFields });
          let updatedSchemaFinalized = yup[`object`]()[`shape`]({
            ...updatedSchemaFields,
          });
          return updatedSchemaFinalized;
        });

        eventTyped.target.parentNode?.parentNode?.removeChild(
          eventTyped.target.parentNode
        );
        setFormPreviewData((previousFormPreviewData) => {
          console.log({ inputsDeletionCallBack });
          if (inputsDeletionCallBack) {
            let dataReset = inputsDeletionCallBack();
            console.log({ dataReset });
            return {
              ...previousFormPreviewData,
              [`current`]: {
                [`type`]: mediaType,
                [`data`]: dataReset,
              },
            };
          } else {
            return previousFormPreviewData;
          }
        });
        setMediaDataIds((previousMediaDataIds) => {
          let idsConfig = {
            ...previousMediaDataIds,
            [`current`]: {
              ...previousMediaDataIds[`current`],
              [mediaType]: ``,
            },
          };
          return idsConfig;
        });
      };
    } else {
      newFormElementsRemoveButton.innerHTML = `-`;
      newFormElementsRemoveButton.onclick = (event) => {
        let eventTyped = (event as unknown) as React.ChangeEvent<HTMLInputElement>;

        let allRetrievedSubInputs = (eventTyped.target.parentNode?.parentNode
          ?.childNodes as unknown) as Array<HTMLDivElement>;

        let allRetrievedSubInputsConverted = Array.prototype.slice.call(
          allRetrievedSubInputs
        );

        let retrievedElementIndex = allRetrievedSubInputsConverted.findIndex(
          (element) =>
            element.id ===
            `${mediaType}-${mediaKeyRef}-${dataKeyRefId}-subId-${generatedSubId}`
        );

        let updatedSubInputsValues: Array<string> = [];

        allRetrievedSubInputs.forEach((referenceElement) => {
          let typedSubInputElement = (referenceElement
            .childNodes[2] as unknown) as HTMLInputElement;
          updatedSubInputsValues.push(typedSubInputElement.value);
        });

        if (updatedSubInputsValues.length >= 1) {
          if (
            retrievedElementIndex > 0 &&
            retrievedElementIndex < updatedSubInputsValues.length - 1
          ) {
            updatedSubInputsValues.splice(retrievedElementIndex, 1);
          } else if (
            retrievedElementIndex === updatedSubInputsValues.length - 1 &&
            retrievedElementIndex !== 0
          ) {
            updatedSubInputsValues.pop();
          } else if (retrievedElementIndex === 0) {
            updatedSubInputsValues.shift();
          }
        }

        formikConf.setFieldValue(
          `${mediaType}s.${mediaType}Data-${dataKeyRefId}.${mediaKeyRef}s`,
          updatedSubInputsValues
        );

        console.log({
          subIndexCheckForRemoving: allRetrievedSubInputs.length - 1,
        });

        setValidSchema((prevYupSchema: any) => {
          let updatedSchema = createYupSchema({
            schema: prevYupSchema,
            config: {
              id: {
                mediaType: `${mediaType}s`,
                dataRefId: `${mediaType}Data-${dataKeyRefId}`,
                inputKeyRef: `${mediaKeyRef}s`,
              },
              validationType: `array`,
              validations: [
                {
                  type: `of`,
                  params: yup.string().required(),
                },
                {
                  type: `length`,
                  params: allRetrievedSubInputs.length - 1,
                },
              ],
            },
          });
          return updatedSchema;
        });

        console.log({ allRetrievedSubInputs, updatedSubInputsValues });

        eventTyped.target.parentNode?.parentNode?.removeChild(
          eventTyped.target.parentNode
        );
      };
    }

    if (whatType === `textInputWithSubIndex`) {
      newFormElementsContainer.append(newFormElementsRemoveButton);
      newFormElementsContainer.appendChild(newFormElementLabel);
      newFormElementsContainer.appendChild(newFormElement);
    } else {
      newFormElementsContainer.appendChild(newFormElementLabel);
      newFormElementsContainer.append(newFormElementsRemoveButton);
      newFormElementsContainer.appendChild(newFormElement);
    }
    return newFormElementsContainer;
  };

  // Handle addition of new form inputs
  const addNewInputs = (
    whichMediaType: string,
    inputElementsKeyRefs: Array<{
      key: string;
      typeOfInput: string;
      childrenElements?: Array<any>;
      initialValue?: any;
    }>,
    inputsDeletionCallback: Function,
    elementToAppendTo?: HTMLElement,
    inputId?: string
  ) => {
    let newFormInputs;

    let newFormInputElementsHold = [];

    let newFormInputElementsForSubInputsHold: Record<string, Array<any>> = {};

    inputElementsKeyRefs.forEach((keyRef) => {
      if (keyRef.typeOfInput === `textInputWithSubIndex`) {
        newFormInputElementsForSubInputsHold = {
          ...newFormInputElementsForSubInputsHold,
          [`${keyRef.key}`]: [],
        };
      }
    });

    let newSubInputsId = v4();

    let dataConfigObject: object = {};

    for (let i = 0; i < inputElementsKeyRefs.length; i++) {
      /*
      let mediaKeyRefFirstLetterCapitalized =
        inputElementsKeyRefs[i].key[0].toUpperCase() +
        inputElementsKeyRefs[i].key.slice(1);
        */

      if (inputElementsKeyRefs[i].typeOfInput === `textInputWithSubIndex`) {
        newFormInputElementsForSubInputsHold[
          `${inputElementsKeyRefs[i].key}`
        ].push(
          newFormElement(
            `${inputElementsKeyRefs[i].typeOfInput}`,
            `${whichMediaType}`,
            `${inputElementsKeyRefs[i].key}`,
            inputId ? inputId : newSubInputsId,
            `${whichMediaType}-${inputElementsKeyRefs[i].key}`,
            undefined,
            undefined,
            inputElementsKeyRefs[i][`initialValue`]
              ? inputElementsKeyRefs[i][`initialValue`]
              : undefined
          )
        );
      } else if (inputElementsKeyRefs[i].typeOfInput === `textInput`) {
        newFormInputElementsHold.push(
          newFormElement(
            `${inputElementsKeyRefs[i].typeOfInput}`,
            `${whichMediaType}`,
            `${inputElementsKeyRefs[i].key}`,
            inputId ? inputId : newSubInputsId,
            `${whichMediaType}-${inputElementsKeyRefs[i].key}`,
            undefined,
            undefined,
            inputElementsKeyRefs[i][`initialValue`]
              ? inputElementsKeyRefs[i][`initialValue`]
              : undefined
          )
        );
        dataConfigObject = {
          ...dataConfigObject,
          [`${inputElementsKeyRefs[i].key}`]: undefined,
        };
      } else if (inputElementsKeyRefs[i].typeOfInput === `fileInput`) {
        newFormInputElementsHold.push(
          newFormElement(
            `${inputElementsKeyRefs[i].typeOfInput}`,
            `${whichMediaType}`,
            `${inputElementsKeyRefs[i].key}`,
            inputId ? inputId : newSubInputsId,
            `${whichMediaType}-${inputElementsKeyRefs[i].key}`,
            undefined,
            undefined,
            inputElementsKeyRefs[i][`initialValue`]
              ? inputElementsKeyRefs[i][`initialValue`]
              : undefined
          )
        );
        dataConfigObject = {
          ...dataConfigObject,
          [`${inputElementsKeyRefs[i].key}`]: undefined,
        };
      } else if (inputElementsKeyRefs[i].typeOfInput === `listInput`) {
        newFormInputElementsHold.push(
          newFormElement(
            `${inputElementsKeyRefs[i].typeOfInput}`,
            `${whichMediaType}`,
            `${inputElementsKeyRefs[i].key}`,
            inputId ? inputId : newSubInputsId,
            `${whichMediaType}-${inputElementsKeyRefs[i].key}`,
            inputElementsKeyRefs[i].childrenElements,
            undefined,
            inputElementsKeyRefs[i][`initialValue`]
              ? inputElementsKeyRefs[i][`initialValue`]
              : undefined
          )
        );
        dataConfigObject = {
          ...dataConfigObject,
          [`${inputElementsKeyRefs[i].key}`]: undefined,
        };
      } else {
        setValidSchema((prevYupSchema: any) => {
          let updatedSchema = createYupSchema({
            schema: prevYupSchema,
            config: {
              id: {
                mediaType: `${whichMediaType}s`,
                dataRefId: `${whichMediaType}Data-${
                  inputId ? inputId : newSubInputsId
                }`,
                inputKeyRef: `${inputElementsKeyRefs[i].key}`,
              },
              validationType: `string`,
              validations: [
                {
                  type: `required`,
                  params: `Please enter ${inputElementsKeyRefs[i].key}`,
                },
              ],
            },
          });
          return updatedSchema;
        });
        dataConfigObject = {
          ...dataConfigObject,
          [`${inputElementsKeyRefs[i].key}`]: undefined,
        };
      }
    }

    for (let sI in newFormInputElementsForSubInputsHold) {
      let subInputsLength = newFormInputElementsForSubInputsHold[sI].length;
      console.log({ subInputsLength });
      if (subInputsLength > 0) {
        dataConfigObject = { ...dataConfigObject, [`${sI}s`]: undefined };

        let initialSubInputsFragment = document.createElement("div");
        initialSubInputsFragment.className = `elementAdjustmentsForSubInputs`;

        let addSubInputButton = document.createElement("div");
        addSubInputButton.className = `${whichMediaType}-add-${sI}-button`;
        addSubInputButton.innerHTML = `+`;
        addSubInputButton.onclick = (event) => {
          let eventTyped = (event as unknown) as React.ChangeEvent<HTMLInputElement>;

          const retrievingNewSubIndex = () => {
            let clarifiedNewSubIndex =
              eventTyped.target.parentNode?.childNodes[3].childNodes.length;
            return clarifiedNewSubIndex;
          };
          const retrievedNewSubIndex = retrievingNewSubIndex();
          console.log({
            subIndexCheckForAdding: retrievedNewSubIndex
              ? retrievedNewSubIndex + 1
              : -1,
          });

          let addedSubInputElement = newFormElement(
            `textInputWithSubIndex`,
            `${whichMediaType}`,
            `${sI}`,
            inputId ? inputId : newSubInputsId,
            `${whichMediaType}-${sI}`
          );

          setValidSchema((prevYupSchema: any) => {
            let updatedSchema = createYupSchema({
              schema: prevYupSchema,
              config: {
                id: {
                  mediaType: `${whichMediaType}s`,
                  dataRefId: `${whichMediaType}Data-${
                    inputId ? inputId : newSubInputsId
                  }`,
                  inputKeyRef: `${sI}s`,
                },
                validationType: `array`,
                validations: [
                  {
                    type: `of`,
                    params: yup.string().required(),
                  },
                  {
                    type: `length`,
                    params: retrievedNewSubIndex ? retrievedNewSubIndex + 1 : 1,
                  },
                ],
              },
            });
            console.log(`checking if logic is firing for adding subInputs`, {
              retrievedNewSubIndex,
              updatedSchema,
            });
            return updatedSchema;
          });

          eventTyped.target.parentNode?.childNodes[3].appendChild(
            addedSubInputElement
          );

          addedSubInputElement.scrollIntoView(false);
        };

        let initialSubInputs = newFormElement(
          `inputsContainer`,
          `${whichMediaType}`,
          `${sI}s`,
          inputId ? inputId : newSubInputsId,
          `${whichMediaType}-${sI}s`,
          newFormInputElementsForSubInputsHold[sI]
        );

        initialSubInputs.firstChild?.after(addSubInputButton);

        newFormInputElementsHold.push(initialSubInputs);

        setValidSchema((prevYupSchema: any) => {
          let updatedSchema = createYupSchema({
            schema: prevYupSchema,
            config: {
              id: {
                mediaType: `${whichMediaType}s`,
                dataRefId: `${whichMediaType}Data-${
                  inputId ? inputId : newSubInputsId
                }`,
                inputKeyRef: `${sI}s`,
              },
              validationType: `array`,
              validations: [
                {
                  type: `of`,
                  params: yup.string().required(),
                },
                {
                  type: `length`,
                  params: subInputsLength,
                },
              ],
            },
          });
          return updatedSchema;
        });
      }
    }

    console.log({ inputsDeletionCallBackp1: inputsDeletionCallback() });

    newFormInputs = newFormElement(
      `inputsContainer`,
      `${whichMediaType}`,
      `data`,
      inputId ? inputId : newSubInputsId,
      `${whichMediaType}`,
      newFormInputElementsHold,
      dataConfigObject,
      undefined,
      inputsDeletionCallback
    );

    if (elementToAppendTo) {
      elementToAppendTo.appendChild(newFormInputs);
      newFormInputs.scrollIntoView(false);
    }
    return {
      id: `${whichMediaType}Data-${inputId ? inputId : newSubInputsId}`,
      inputs: newFormInputs,
    };
  };

  // Declare function for switching between mini forms
  const switchMediaMiniForm = (switchTo: string) => {
    for (let x in storedRefs) {
      let checkedIfMiniForm = RegExp(`MiniForm`).test(x);
      if (checkedIfMiniForm) {
        let checkedIfFormMatches = RegExp(switchTo).test(x);
        console.log({ storedRefs, x });
        if (checkedIfFormMatches) {
          storedRefs[x].current.style.display = `flex`;
        } else {
          storedRefs[x].current.style.display = `none`;
        }
      }
    }
  };

  // Handle styling of currently selected media data inputs
  const handleCurrentMediaInputsSelectedStyle = (
    childNodesForStyling: Array<HTMLDivElement>,
    selectedChildId: string,
    mediaType: string
  ) => {
    for (let q = 0; q < childNodesForStyling.length; q++) {
      let childNodeTyped = (childNodesForStyling[
        q
      ] as unknown) as HTMLDivElement;
      let childNodeLabelElementTyped = (childNodeTyped[
        `childNodes`
      ][0] as unknown) as HTMLDivElement;
      if (childNodeTyped.id.includes(selectedChildId)) {
        childNodeTyped.style.backgroundColor = `blue`;
        childNodeLabelElementTyped.className = `media-selected-label`;
      } else {
        childNodeTyped.style.backgroundColor = `black`;
        childNodeLabelElementTyped.className = `${mediaType}-label`;
      }
    }
  };

  // Hanlde creation and updates to form yup validation schema
  const createYupSchema = (opts?: {
    schema: any;
    config: {
      id: { mediaType: string; dataRefId: string; inputKeyRef: string };
      validationType: any;
      validations: Array<{ type: string; params: any }>;
    };
  }) => {
    const yupv2 = yup as any;

    if (opts) {
      let updatedSchema = { ...opts[`schema`] };
      let updatedSchemaFields = updatedSchema[`fields`];
      const { id, validationType, validations } = opts[`config`];
      if (!yupv2[validationType]) {
        return updatedSchema;
      }
      let validator = yupv2[validationType]();
      validations.forEach((validation) => {
        const { type, params } = validation;
        if (!validator[type]) {
          return;
        }
        validator = validator[type](params);
      });

      updatedSchemaFields[id[`mediaType`]] = yup.object().shape(
        updatedSchemaFields[id[`mediaType`]] &&
          updatedSchemaFields[id[`mediaType`]][`fields`]
          ? {
              ...updatedSchemaFields[id[`mediaType`]][`fields`],
              [id[`dataRefId`]]: yup.object().shape(
                updatedSchemaFields[id[`mediaType`]][`fields`][
                  id[`dataRefId`]
                ] &&
                  updatedSchemaFields[id[`mediaType`]][`fields`][
                    id[`dataRefId`]
                  ][`fields`]
                  ? {
                      ...updatedSchemaFields[id[`mediaType`]][`fields`][
                        id[`dataRefId`]
                      ][`fields`],
                      [id[`inputKeyRef`]]: validator,
                    }
                  : {
                      [id[`inputKeyRef`]]: validator,
                    }
              ),
            }
          : {
              [id[`dataRefId`]]: yup.object().shape({
                [id[`inputKeyRef`]]: validator,
              }),
            }
      );

      let updatedSchemaFinalized = yup[`object`]()[`shape`]({
        ...updatedSchemaFields,
      });
      return updatedSchemaFinalized;
    }
  };

  // Configurations for form
  const formikConf = useFormik({
    initialValues: initialFormValues,
    validationSchema: validSchema,
    onSubmit: (props) => {
      handleFormSubmission({ ...props });
    },
  });

  // Handle incoming data for form
  React.useEffect(() => {
    if (dataForForm[`forId`] !== `` && dataForForm[`forId`] !== undefined) {
      if (dataForForm[`forId`][`includes`](`forStorage`)) {
        console.log(`includes for storage`);
        let dataId = dataForForm[`forId`];
        let idExtracted = dataId.slice(11);
        let extractedKey = dataId.substring(11, dataId.lastIndexOf(`Data`));
        console.log({ idExtracted, extractedKey, dataForForm });
        formikConf.setFieldValue(
          `${extractedKey}s.${idExtracted}.${dataForForm[`forInput`]}`,
          dataForForm[`inputValue`]
        );
        setFormPreviewData((previousFormPreviewData) => {
          console.log({
            previousFormPreviewDataCheckText: previousFormPreviewData,
          });
          return {
            ...previousFormPreviewData,
            stored: {
              ...previousFormPreviewData[`stored`],
              [`${extractedKey}s`]: {
                ...previousFormPreviewData[`stored`][`${extractedKey}s`],
                [`${idExtracted}`]: {
                  ...previousFormPreviewData[`stored`][`${extractedKey}s`][
                    `${idExtracted}`
                  ],
                  [`${dataForForm[`forInput`]}`]: dataForForm[`inputValue`],
                },
              },
            },
          };
        });
      }
      if (dataForForm[`forId`][`includes`](`freshForm`)) {
        setExtraHeaderOptions(() => {
          return (
            <div
              className={
                styles.extraHeaderOptionFreshFormBackToApiFrontPageButton
              }
              onClick={(event) => {
                dataForForm[`inputValue`][`resetData`]();
                dataForForm[`inputValue`][`backToApi`]();
                setExtraHeaderOptions(() => {
                  return <></>;
                });
              }}
            >{`CANCEL NEW IDEA`}</div>
          );
        });
      } else if (dataForForm[`forId`][`includes`](`DataAnnihilation`)) {
        console.log(`Data annihilation initiated`);
        let forValidSchema = {};
        initialInputs.forEach((values) => {
          formikConf.setFieldValue(`test.${values.name}`, ``);
          forValidSchema = {
            ...forValidSchema,
            [`${values.name}`]: yup.string().required(),
          };
        });

        setValidSchema((prevValidSchema: any) => {
          console.log({ prevValidSchemaForDataAnnihilation: prevValidSchema });
          const schemaReset = yup.object().shape({
            test: yup.object().shape(forValidSchema),
          });
          return schemaReset;
        });

        mediaInputsNav.forEach((values) => {
          formikConf.setFieldValue(
            `${values.mediaType}s`,
            dataForForm[`inputValue`]
          );
        });
      } else if (dataForForm[`forId`][`includes`](`fetchedProjectData`)) {
        console.log(`fetched project data for form process initiated`, {
          dataForForm,
        });

        mediaMiniFormInputs.forEach((values) => {
          for (let k in dataForForm[`inputValue`][`${values.mediaType}s`]) {
            let dataExtracted =
              dataForForm[`inputValue`][`${values.mediaType}s`][k];
            let configgedInputOpts = values.inputsOpts.map((opts) => {
              let retrievedIndexedData =
                dataExtracted[
                  opts.typeOfInput === `textInputWithSubIndex`
                    ? `${opts.key}s`
                    : opts.key
                ];
              return {
                ...opts,
                initialValue:
                  typeof retrievedIndexedData === `object`
                    ? retrievedIndexedData[0]
                    : retrievedIndexedData,
              };
            });
            const { id } = addNewInputs(
              `${values.mediaType}`,
              configgedInputOpts,
              values.inputsDeletionCallback,
              storedRefs[`${values.mediaType}sInputViewRef`].current,
              dataExtracted[`id`]
            );
          }
        });
        console.log({ formikConfForFetchedDataP1: formikConf, validSchema });

        initialInputs.forEach((values) => {
          formikConf.setFieldValue(
            `test.${values.name}`,
            dataForForm[`inputValue`][`test`][`${values.name}`]
          );
        });

        mediaMiniFormInputs.forEach((values) => {
          formikConf.setFieldValue(
            `${values.mediaType}s`,
            dataForForm[`inputValue`][`${values.mediaType}s`]
          );
        });
        console.log({ formikConfForFetchedDataP2: formikConf });
        setExtraHeaderOptions(() => {
          return (
            <div
              className={
                styles.extraHeaderOptionFetchedProjectDataBackToFullPreviewPageButton
              }
              onClick={(event) => {
                setFormPreviewData((previousFormPreviewData) => {
                  return {
                    ...previousFormPreviewData,
                    [`current`]: {
                      ...previousFormPreviewData[`current`],
                      [`type`]: `viewExistingProject`,
                      [`data`]: dataForForm[`inputValue`],
                    },
                  };
                });
                dataForForm[`inputValue`][`resetData`](true, true);
                setExtraHeaderOptions(() => {
                  return <></>;
                });
              }}
            >{`CANCEL EDIT`}</div>
          );
        });

        setFormPreviewData((previousFormPreviewData) => {
          return {
            ...previousFormPreviewData,
            [`current`]: {
              ...previousFormPreviewData[`current`],
              [`type`]: `formFilledForFetchedProject`,
            },
          };
        });
      }
    }
  }, [dataForForm]);

  // Handle component return view
  return (
    <div className={styles.formEmbedder}>
      <form onSubmit={formikConf.handleSubmit}>
        <div
          ref={storedRefs[`innerFormDisplayRef`]}
          className={styles.innerFormMainDisplay}
          style={styles.innerFormDisplaySupport}
        >
          <div className={styles[`formOptionsContainer`]}>
            <div className={styles.formDataInputsHeader}>
              {extraHeaderOptions}
              <button
                type={`submit`}
                className={styles.innerFormSubmitButton}
              >{`Submit`}</button>
            </div>
            <div className={styles[`formOptionsInitialInputs`]}>
              {initialInputs.map((values) => {
                return (
                  <input
                    name={`test.${values.name}`}
                    placeholder={`${values.name.toUpperCase()}`}
                    className={styles.anIdeaTitle}
                    type={values.inputType}
                    value={formikConf.values.test[`${values.name}`]}
                    onChange={(event) => {
                      formikConf.handleChange(event);
                      formikConf.handleBlur(event);
                    }}
                    onBlur={formikConf.handleBlur}
                    autoComplete={"off"}
                  />
                );
              })}
            </div>
            <div className={styles.mediaSelectionNavDisplay}>
              {mediaInputsNav.map((values) => {
                return (
                  <div
                    className={styles.mediaSelectionNavButton}
                    onClick={(event) => {
                      switchMediaMiniForm(`${values.mediaType}s`);
                      setFormPreviewData((previousMediaPreviewData) => {
                        const fetchingMediaPreviewData = () => {
                          if (
                            mediaDataIds[`current`][`${values.mediaType}`] !==
                              `` &&
                            mediaDataIds[`current`][`${values.mediaType}`] !==
                              -1
                          ) {
                            return {
                              ...previousMediaPreviewData,
                              current: {
                                type: `${values.mediaType}`,
                                data:
                                  formikConf[`values`][`${values.mediaType}s`][
                                    mediaDataIds[`current`][
                                      `${values.mediaType}`
                                    ]
                                  ],
                              },
                            };
                          } else {
                            return previousMediaPreviewData;
                          }
                        };
                        const fetchedMediaPreviewData = fetchingMediaPreviewData();
                        return fetchedMediaPreviewData;
                      });
                    }}
                  >{`${values.buttonText}`}</div>
                );
              })}
            </div>
          </div>
          {mediaMiniFormInputs.map((values) => {
            return (
              <div
                ref={storedRefs[`${values.mediaType}sMiniForm`]}
                className={styles.innerFormSectionContainer}
              >
                <button
                  type={`button`}
                  className={styles.innerFormAddInputButton}
                  onClick={(event) => {
                    const { id } = addNewInputs(
                      `${values.mediaType}`,
                      values.inputsOpts,
                      values.inputsDeletionCallback,
                      storedRefs[`${values.mediaType}sInputViewRef`].current
                    );
                    const eventTyped = (event as unknown) as React.ChangeEvent<HTMLButtonElement>;
                    const parentNodeRetrieved = (eventTyped[`currentTarget`][
                      `parentNode`
                    ] as unknown) as HTMLDivElement;
                    const inputsContainerRetrieved = (parentNodeRetrieved[
                      `childNodes`
                    ][1][`childNodes`] as unknown) as Array<HTMLDivElement>;

                    handleCurrentMediaInputsSelectedStyle(
                      inputsContainerRetrieved,
                      id,
                      values.mediaType
                    );
                    setMediaDataIds((previousMediaDataIds: any) => {
                      return {
                        ...previousMediaDataIds,
                        [`current`]: {
                          ...previousMediaDataIds[`current`],
                          [`${values.mediaType}`]: id,
                        },
                      };
                    });
                    setFormPreviewData((previousFormPreviewData) => {
                      return {
                        ...previousFormPreviewData,
                        current: {
                          type: `${values.mediaType}`,
                          data:
                            formikConf[`values`][`${values.mediaType}s`][id],
                        },
                      };
                    });
                  }}
                >{`${values.addButtonText}`}</button>
                <div
                  ref={storedRefs[`${values.mediaType}sInputViewRef`]}
                  className={styles.innerFormSectionInputs}
                ></div>
              </div>
            );
          })}
        </div>
      </form>
    </div>
  );
};

const API: React.FC = () => {
  // Deconstruct from useAuth0
  const { isAuthenticated } = useAuth0();
  // Handle screen size detection and changes
  const [screenHeight, setScreenHeight] = React.useState(() => {
    let fetchedScreenHeight = Dimensions.get("window").height;
    return fetchedScreenHeight;
  });
  const [screenWidth, setScreenWidth] = React.useState(() => {
    let fetchedScreenWidth = Dimensions.get("window").width;
    return fetchedScreenWidth;
  });

  $(window).on("resize", () => {
    setScreenHeight(() => {
      let fetchedScreenHeight = Dimensions.get("window").height;
      return fetchedScreenHeight;
    });
    setScreenWidth(() => {
      let fetchedScreenWidth = Dimensions.get("window").width;
      return fetchedScreenWidth;
    });
  });

  // Handle screen size changes
  React.useEffect(() => {
    let updatedHeightConfig = {
      ...styles,
      mainDisplaySupportStyle: {
        ...styles.mainDisplaySupportStyle,
        height: `${Dimensions[`get`](`window`)[`height`]}px`,
      },
      innerFormDisplaySupport: {
        ...styles.innerFormDisplaySupport,
        borderWidth:
          formPreviewData[`current`][`type`] === `allNewData` ||
          formPreviewData[`current`][`type`] === `apiFrontPage` ||
          formPreviewData[`current`][`type`] === `viewExistingProject` ||
          formPreviewData[`current`][`type`] === `reCheck`
            ? 0
            : 2,
        height:
          formPreviewData[`current`][`type`] === `allNewData` ||
          formPreviewData[`current`][`type`] === `apiFrontPage` ||
          formPreviewData[`current`][`type`] === `viewExistingProject` ||
          formPreviewData[`current`][`type`] === `reCheck`
            ? `0%`
            : `${(screenHeight / 100) * 15 - 2}px`,
      },
      outterMediaPreviewDisplaySupport: {
        ...styles.outterMediaPreviewDisplaySupport,
        height:
          formPreviewData[`current`][`type`] === `allNewData` ||
          formPreviewData[`current`][`type`] === `apiFrontPage` ||
          formPreviewData[`current`][`type`] === `viewExistingProject` ||
          formPreviewData[`current`][`type`] === `reCheck`
            ? `${(Dimensions[`get`](`window`)[`height`] / 100) * 95}px`
            : `${(screenHeight / 100) * 80}px`,
      },
    };
    setStyles(updatedHeightConfig);
  }, [screenHeight, screenWidth]);

  // Declare stylesheet for manipulation
  const [styles, setStyles] = React.useState(() => {
    return {
      mainDisplay: styles2.mainDisplay,
      mainDisplaySupportClass: `mainAPIDisplaySupportClass`,
      mainDisplaySupportStyle: {
        width: `100%`,
        height: `${screenHeight}px`,
      },
      [`headerBarForAPI`]: `headerBarForAPI`,
      [`headerBarForAPISupport`]: {
        [`height`]: `${(screenHeight / 100) * 5}px`,
      },
      formEmbedder: `formEmbedder`,
      innerFormMainDisplay: `innerFormMainDisplay`,
      innerFormDisplaySupport: {
        borderWidth: 0,
        width: `100%`,
        height: `0%`,
      },
      [`formOptionsContainer`]: `formOptionsContainer`,
      innerFormSectionContainer: `innerFormSectionContainer`,
      innerFormSectionInputs: `innerFormSectionInputs`,
      innerFormAddInputButton: `innerFormAddInputButton`,
      innerFormSubmitButton: `innerFormSubmitButton`,
      formDataInputsHeader: `formDataInputsHeader`,
      [`formOptionsInitialInputs`]: `formOptionsInitialInputs`,
      extraHeaderOptionFreshFormBackToApiFrontPageButton: `extraHeaderOptionFreshFormBackToApiFrontPageButton`,
      extraHeaderOptionFetchedProjectDataBackToFullPreviewPageButton: `extraHeaderOptionFetchedProjectDataBackToFullPreviewPageButton`,
      anIdeaTitle: `anIdeaTitle`,
      mediaSelectionNavDisplay: `mediaSelectionNavDisplay`,
      mediaSelectionNavButton: `mediaSelectionNavButton`,
      mediaSelectionNavButtonDisabled: `mediaSelectionNavButtonDisabled`,
      outterMediaPreviewDisplay: `outterMediaPreviewDisplay`,
      outterMediaPreviewDisplaySupport: {
        width: `100%`,
        height: `${(Dimensions[`get`](`window`)[`height`] / 100) * 95}px`,
      },
      innerMediaPreviewDisplay: `innerMediaPreviewDisplay`,
      previewDisplayImage: `previewDisplayImage`,
      passageContentText: `passage-content-text-input`,
      finalInnerMediaPreviewDisplay: `finalInnerMediaPreviewDisplay`,
      finalMediaPreviewsConsolidated: `finalMediaPreviewsConsolidated`,
      finalIdeaTitle: `finalIdeaTitle`,
      finalVideoPreview: `finalVideoPreview`,
      finalVideoExtendedDataPreview: `finalVideoExtendedDataPreview`,
      finalVideoName: `finalVideoName`,
      finalVideoType: `finalVideoType`,
      finalPhotoPreview: `finalPhotoPreview`,
      finalPhotoExtendedData: `finalPhotoExtendedData`,
      finalPhotoTitle: `finalPhotoTitle`,
      finalPhotoReferences: `finalPhotoReferences`,
      finalPassagePreview: `finalPassagePreview`,
      finalPassageContentPreview: `finalPassageContentPreview`,
      finalPassageExtendedDataPreview: `finalPassageExtendedDataPreview`,
      finalPassageTitlePreview: `finalPassageTitlePreview`,
      finalPassageWhatIsItPreview: `finalPassageWhatIsItPreview`,
      finalPassageReferencesPreview: `finalPassageReferencesPreview`,
      finalizeOptions: `finalizeOptions`,
      returnToEditButton: `returnToEditButton`,
      finalizeDataButton: `finalizeDataButton`,
      retrievedProjectOptions: `retrievedProjectOptions`,
      backToApiFrontPageButton: `backToApiFrontPageButton`,
      projectsNavigationBar: `projectsNavigationBar`,
      projectsNavigationPrevious: `projectsNavigationPrevious`,
      projectsNavigationNext: `projectsNavigationNext`,
      editFetchedProjectButton: `editFetchedProjectButton`,
      destroyProjectButton: `destroyProjectButton`,
      dataUploadConfirmationPage: `dataUploadConfirmationPage`,
      dataUploadConfirmationTitle: `dataUploadConfirmationTitle`,
      dataUploadConfirmationOptions: `dataUploadConfirmationOptions`,
      dataUploadConfirmationOptionYes: `dataUploadConfirmationOptionYes`,
      dataUploadConfirmationOptionNo: `dataUploadConfirmationOptionNo`,
      apiFrontPage: `apiFrontPage`,
      createNewIdeaButton: `createNewIdeaButton`,
      browseIdeasForEditButton: `browseIdeasForEditButton`,
      toMainProjectsPageButton: `toMainProjectsPageButton`,
    };
  });

  // Declare variable holding authorization status
  const [authorizationStatus, setAuthorizationStatus] = React.useState(() => ({
    [`authorizedId`]: ``,
    [`personalAccess`]: ``,
  }));

  // Declare variable holding initial form values
  const [
    initialFormValues,
    setInitialFormValues,
  ] = React.useState<genericObject>(() => {
    return {
      test: { title: `` },
      videos: {},
      muralPhotos: {},
      galleryPhotos: {},
      passages: {},
      etcs: {},
    };
  });

  // Declare variable holding media data ids
  const [mediaDataIds, setMediaDataIds] = React.useState<{
    current: {
      video: string | number;
      galleryPhoto: string | number;
      passage: string | number;
      fetchedProject?: {
        id: string;
        index: number;
      };
    };
    dataBaseProjectIds?: Array<string>;
  }>(() => {
    return {
      current: {
        video: ``,
        galleryPhoto: ``,
        passage: ``,
      },
    };
  });

  // Declare variable holding current form media preview data
  const [formPreviewData, setFormPreviewData] = React.useState<{
    stored: any;
    current: { type: string; data: any };
  }>(() => {
    return {
      stored: {
        passages: {},
      },
      current: {
        type: `apiFrontPage`,
        data: {},
      },
    };
  });

  const [formPreviewDisplay, setFormPreviewDisplay] = React.useState(() => {
    return (
      <div className={styles.apiFrontPage}>
        <div
          className={styles.createNewIdeaButton}
          onClick={() => {
            createNewIdea();
          }}
        >{`CREATE NEW IDEA`}</div>
      </div>
    );
  });

  // Declare variable holding form yup schema
  const [validSchema, setValidSchema] = React.useState(() => {
    const initialSchema = yup.object().shape({
      test: yup.object().shape({
        title: yup.string().required(),
      }),
    });
    return initialSchema;
  });

  // Declare variable holding data for form
  const [dataForForm, setDataForForm] = React.useState<{
    forId: string | number;
    forInput: string | number;
    inputValue: string | Object | undefined;
  }>(() => {
    return {
      forId: ``,
      forInput: ``,
      inputValue: ``,
    };
  });

  // Declare DOM refs for view manipulation and data extraction
  let storedRefs: Record<string, React.MutableRefObject<any>> = {
    innerFormDisplayRef: React.useRef<any>(),
    videosInputViewRef: React.useRef<any>(),
    videosMiniForm: React.useRef(),
    galleryPhotosInputViewRef: React.useRef<any>(),
    galleryPhotosMiniForm: React.useRef(),
    passagesInputViewRef: React.useRef<any>(),
    passagesMiniForm: React.useRef(),
  };

  let finalVideosMediaPreviewsRef = React.useRef<any>();
  let finalGalleryPhotosMediaPreviewsRef = React.useRef<any>();
  let finalJournalMediaPreviewsRef = React.useRef<any>();
  let destroyProjectButtonRef = React.useRef<any>();

  // Declare function handling fresh form page
  const createNewIdea = () => {
    setStyles((previousStyles) => {
      return {
        ...previousStyles,
        innerFormDisplaySupport: {
          ...previousStyles.innerFormDisplaySupport,
          height: `${(screenHeight / 100) * 15 - 2}px`,
          borderWidth: 2,
        },
        outterMediaPreviewDisplaySupport: {
          ...previousStyles.outterMediaPreviewDisplaySupport,
          height: `${(screenHeight / 100) * 80}px`,
        },
      };
    });
    setDataForForm((previousDataForForm) => {
      return {
        ...previousDataForForm,
        forId: `freshForm`,
        forInput: `AllFormInputs`,
        inputValue: {
          resetData: executeDataReset,
          backToApi: backToApiFrontPage,
        },
      };
    });
    setFormPreviewData((previousFormPreviewData) => {
      return {
        ...previousFormPreviewData,
        [`current`]: {
          [`type`]: `freshForm`,
          [`data`]: undefined,
        },
      };
    });
    setFormPreviewDisplay(() => {
      return (
        <div
          className={styles.innerMediaPreviewDisplay}
        >{`No Media Data To View`}</div>
      );
    });
  };

  // Handle fetching of previous project
  const retrievePreviousFetchedProject = async (
    stayAboveFirstIndex?: boolean,
    customMediaDataIds?: any
  ) => {
    let forStorage = { passages: {}, gallery: {} };
    let allVideosData = {};
    let allGalleryData = {};
    let allJournalData = {};
    let consolidatedData = {};
    let configuredId = { id: ``, index: -1 };
    if (
      mediaDataIds[`current`][`fetchedProject`] &&
      mediaDataIds[`dataBaseProjectIds`]
    ) {
      const retrievedCurrentProjectIndex = customMediaDataIds
        ? customMediaDataIds[`current`][`fetchedProject`][`index`]
        : mediaDataIds[`current`][`fetchedProject`][`index`];
      const prevProjectIndex =
        retrievedCurrentProjectIndex <= 0
          ? stayAboveFirstIndex
            ? 0
            : customMediaDataIds
            ? customMediaDataIds[`dataBaseProjectIds`].length - 1
            : mediaDataIds[`dataBaseProjectIds`].length - 1
          : retrievedCurrentProjectIndex - 1;
      const fetchedProjectData = await projectDataFetch(
        customMediaDataIds
          ? customMediaDataIds[`dataBaseProjectIds`][prevProjectIndex]
          : mediaDataIds[`dataBaseProjectIds`][prevProjectIndex]
      );
      const retrievedFullData = fetchedProjectData[`projectData`][`fullData`];
      retrievedFullData[`motionPictures`][`forEach`]((data) => {
        allVideosData = {
          ...allVideosData,
          [`videoData-${data._id}`]: {
            id: data._id,
            name: data.videoName,
            type: data.videoType,
            url: data.videoUrl,
          },
        };
      });
      retrievedFullData[`majorCatalogPhotos`][`forEach`]((data) => {
        forStorage = {
          ...forStorage,
          [`gallery`]: {
            ...forStorage[`gallery`],
            [`galleryPhotoData-${data._id}`]: {
              url: `${dataBaseUrl}photos/${data.photoFilename}`,
            },
          },
        };
        allGalleryData = {
          ...allGalleryData,
          [`galleryPhotoData-${data._id}`]: {
            id: data._id,
            title: data.photoTitle,
            references: data.photoReferences,
            photo: `${dataBaseUrl}photos/${data.photoFilename}`,
          },
        };
      });
      retrievedFullData[`journal`][`forEach`]((data) => {
        forStorage = {
          ...forStorage,
          [`passages`]: {
            ...forStorage[`passages`],
            [`passageData-${data._id}`]: {
              content: data[`content`],
            },
          },
        };
        allJournalData = {
          ...allJournalData,
          [`passageData-${data._id}`]: {
            id: data._id,
            title: data.title,
            whatIsIt: data.whatIsIt,
            content: data.content,
            references: data.references.web,
          },
        };
      });
      consolidatedData = {
        ...consolidatedData,
        [`test`]: { [`title`]: retrievedFullData[`ideaTitle`] },
        [`videos`]: allVideosData,
        [`galleryPhotos`]: allGalleryData,
        [`passages`]: allJournalData,
      };
      configuredId = {
        [`id`]: retrievedFullData[`_id`],
        [`index`]: prevProjectIndex,
      };
      setMediaDataIds((previousMediaDataIds) => {
        const updatedMediaDataIds = customMediaDataIds
          ? {
              ...customMediaDataIds,
              [`current`]: {
                ...customMediaDataIds[`current`],
                [`fetchedProject`]: configuredId,
              },
            }
          : {
              ...previousMediaDataIds,
              [`current`]: {
                ...previousMediaDataIds[`current`],
                [`fetchedProject`]: configuredId,
              },
            };
        return updatedMediaDataIds;
      });
      setFormPreviewData((previousFormPreviewData) => {
        return {
          ...previousFormPreviewData,
          [`stored`]: forStorage,
          [`current`]: {
            [`type`]: `viewExistingProject`,
            [`data`]: consolidatedData,
          },
        };
      });
      console.log({
        mediaDataIds: mediaDataIds,
        prevProjectIndex,
        fetchedProjectData,
      });
    }
  };

  // Handle fetching of next project
  const retrieveNextFetchedProject = async () => {
    let forStorage = { passages: {}, gallery: {} };
    let allVideosData = {};
    let allGalleryData = {};
    let allJournalData = {};
    let consolidatedData = {};
    let configuredId = { id: ``, index: -1 };
    if (
      mediaDataIds[`current`][`fetchedProject`] &&
      mediaDataIds[`dataBaseProjectIds`]
    ) {
      const retrievedCurrentProjectIndex =
        mediaDataIds[`current`][`fetchedProject`][`index`];
      const nextProjectIndex =
        retrievedCurrentProjectIndex >=
        mediaDataIds[`dataBaseProjectIds`].length - 1
          ? 0
          : retrievedCurrentProjectIndex + 1;
      const fetchedProjectData = await projectDataFetch(
        mediaDataIds[`dataBaseProjectIds`][nextProjectIndex]
      );
      const retrievedFullData = fetchedProjectData[`projectData`][`fullData`];
      retrievedFullData[`motionPictures`][`forEach`]((data) => {
        allVideosData = {
          ...allVideosData,
          [`videoData-${data._id}`]: {
            id: data._id,
            name: data.videoName,
            type: data.videoType,
            url: data.videoUrl,
          },
        };
      });
      retrievedFullData[`majorCatalogPhotos`][`forEach`]((data) => {
        forStorage = {
          ...forStorage,
          [`gallery`]: {
            ...forStorage[`gallery`],
            [`galleryPhotoData-${data._id}`]: {
              url: `${dataBaseUrl}photos/${data.photoFilename}`,
            },
          },
        };
        allGalleryData = {
          ...allGalleryData,
          [`galleryPhotoData-${data._id}`]: {
            id: data._id,
            title: data.photoTitle,
            references: data.photoReferences,
            photo: `${dataBaseUrl}photos/${data.photoFilename}`,
          },
        };
      });
      retrievedFullData[`journal`][`forEach`]((data) => {
        forStorage = {
          ...forStorage,
          [`passages`]: {
            ...forStorage[`passages`],
            [`passageData-${data._id}`]: {
              content: data[`content`],
            },
          },
        };
        allJournalData = {
          ...allJournalData,
          [`passageData-${data._id}`]: {
            id: data._id,
            title: data.title,
            whatIsIt: data.whatIsIt,
            content: data.content,
            references: data.references.web,
          },
        };
      });
      consolidatedData = {
        ...consolidatedData,
        [`test`]: { [`title`]: retrievedFullData[`ideaTitle`] },
        [`videos`]: allVideosData,
        [`galleryPhotos`]: allGalleryData,
        [`passages`]: allJournalData,
      };
      configuredId = {
        [`id`]: retrievedFullData[`_id`],
        [`index`]: nextProjectIndex,
      };
      setMediaDataIds((previousMediaDataIds) => {
        return {
          ...previousMediaDataIds,
          [`current`]: {
            ...previousMediaDataIds[`current`],
            [`fetchedProject`]: configuredId,
          },
        };
      });
      setFormPreviewData((previousFormPreviewData) => {
        return {
          ...previousFormPreviewData,
          [`stored`]: forStorage,
          [`current`]: {
            [`type`]: `viewExistingProject`,
            [`data`]: consolidatedData,
          },
        };
      });
      console.log({
        mediaDataIds: mediaDataIds,
        nextProjectIndex,
        fetchedProjectData,
      });
    }
  };

  // Declare function handling confirmation page
  const confirmDataBaseUpload = (forFetchedProject: boolean) => {
    setFormPreviewDisplay(() => {
      return (
        <div className={styles.dataUploadConfirmationPage}>
          <div
            className={styles.dataUploadConfirmationTitle}
          >{`CONFIRM IDEA UPLOAD`}</div>
          <div className={styles.dataUploadConfirmationOptions}>
            <div
              className={styles.dataUploadConfirmationOptionYes}
              onClick={(event) => {
                if (event.currentTarget.innerHTML === `YES`) {
                  event.currentTarget.innerHTML = `UPLOADING...`;
                  event.currentTarget.style.fontSize = `19px`;
                  event.currentTarget.style.cursor = `default`;
                  handleDataBaseUpload(forFetchedProject);
                }
              }}
            >{`YES`}</div>
            <div
              className={styles.dataUploadConfirmationOptionNo}
              onClick={() => {
                setFormPreviewData((previousFormPreviewData) => {
                  return {
                    ...previousFormPreviewData,
                    [`current`]: {
                      ...previousFormPreviewData[`current`],
                      [`type`]: `reCheck`,
                    },
                  };
                });
              }}
            >{`RECHECK`}</div>
          </div>
        </div>
      );
    });
  };

  // Declare function handling removal of child nodes
  const removeAllChildNodes = (parentNode: HTMLElement) => {
    while (parentNode[`firstChild`]) {
      parentNode[`removeChild`](parentNode[`firstChild`]);
    }
  };

  // Declare function handling database update
  const updateTheDataBase = async (formReset?: boolean, IdeaId?: string) => {
    // Retrieve store data
    let storeData = store.getState().projectSliceReducer.projectData;
    // Handle clarification of idea database id
    const ideaTitleForBody = JSON.stringify({
      [`ideaTitle`]: formPreviewData[`current`][`data`][`test`][`title`],
    });

    const updatingDataBaseP1Id = IdeaId
      ? IdeaId
      : await fetch(`${dataBaseUrl}new-idea`, {
          method: `POST`,
          mode: `cors`,
          cache: `no-cache`,
          // credentials: `same-origin`,
          headers: { [`Content-Type`]: `application/json` },
          body: ideaTitleForBody,
        })
          .then((res) => {
            const jsonParsed = res[`json`]();
            return jsonParsed;
          })
          .then((data) => {
            return data[`_id`];
          });

    // Handle adding new idea id to user's authorized data access
    console[`log`]({
      authorizationStatusCheckForAddingProject: authorizationStatus,
    });
    if (
      !(
        mediaDataIds[`dataBaseProjectIds`] &&
        mediaDataIds[`dataBaseProjectIds`][`find`](
          (dataBaseProjectId) =>
            mediaDataIds[`current`][`fetchedProject`] &&
            dataBaseProjectId ===
              mediaDataIds[`current`][`fetchedProject`][`id`]
        )
      )
    ) {
      const addingToUsersAuthorizedDataAccesss = await fetch(
        `${userBaseUrl}updateDataAccess/${
          authorizationStatus[`authorizedId`]
        }/webApp/AnIdea/operationMode/add`,
        {
          method: `PUT`,
          mode: `cors`,
          cache: `no-cache`,
          // credentials: `same-origin`,
          headers: { [`Content-Type`]: `application/json` },
          body: JSON[`stringify`]({ [`projectId`]: updatingDataBaseP1Id }),
        }
      )[`then`]((res) => {
        const json = res[`json`]();
        return json;
      });
      console[`log`]({ addingToUsersAuthorizedDataAccesss });
    }

    // Handle updated title upload
    if (
      storeData[`title`] !== formPreviewData[`current`][`data`][`test`][`title`]
    ) {
      let updatingTitle = await fetch(
        `${dataBaseUrl}${updatingDataBaseP1Id}/full-mutation/title`,
        {
          method: `PUT`,
          mode: `cors`,
          cache: `no-cache`,
          // credentials: `same-origin`,
          headers: { [`Content-Type`]: `application/json` },
          body: ideaTitleForBody,
        }
      )
        .then((res) => {
          const jsonParsed = res.json();
          return jsonParsed;
        })
        .catch((err) => {
          console.log({ error: err });
        });
    }

    // Handle data upload for videos
    if (
      formPreviewData[`current`][`data`][`videos`] &&
      Object.keys(formPreviewData[`current`][`data`][`videos`])[`length`] > 0
    ) {
      let videosDataHold: Array<{
        videoName: string;
        videoUrl: string;
        videoType: string;
      }> = [];

      for (let vD in formPreviewData[`current`][`data`][`videos`]) {
        let extractedDataFromForm =
          formPreviewData[`current`][`data`][`videos`][vD];

        const configuredJSON = {
          videoName: extractedDataFromForm[`name`],
          videoUrl: extractedDataFromForm[`url`],
          videoType: extractedDataFromForm[`type`],
        };

        videosDataHold.push(configuredJSON);
      }
      const stringifiedVideosData = JSON.stringify(videosDataHold);

      const updatingDataBaseP2Videos = await fetch(
        `${dataBaseUrl}${updatingDataBaseP1Id}/${
          IdeaId ? `full-mutation` : `add`
        }/videos`,
        {
          method: `PUT`,
          mode: `cors`,
          cache: `no-cache`,
          headers: { [`Content-Type`]: `application/json` },
          body: stringifiedVideosData,
        }
      );
    }

    if (
      formPreviewData[`current`][`data`][`galleryPhotos`] &&
      Object.keys(formPreviewData[`current`][`data`][`galleryPhotos`])[
        `length`
      ] > 0
    ) {
      // Declare variable holding database url for retrieving photos
      let urlForPhotos = `${dataBaseUrl}photos/`;
      // Handle upload of gallery data
      const galleryFormData = new FormData();
      const retrievedGalleryFormInputs =
        storedRefs[`galleryPhotosInputViewRef`][`current`][`childNodes`];
      const galleryFormPreviewData =
        formPreviewData[`current`][`data`][`galleryPhotos`];
      let retrievedStoreDataForGallery = storeData[`galleryPhotos`];
      let galleryDataHold: Array<any> = [];
      console.log({ galleryStoreData: retrievedStoreDataForGallery });

      for (let u = 0; u < retrievedGalleryFormInputs[`length`]; u++) {
        let photoDataId = retrievedGalleryFormInputs[u][`id`].replace(
          `galleryPhotoData-`,
          ``
        );
        let retrievedStoreDataForPhoto = retrievedStoreDataForGallery.find(
          (photoData) => photoData.id === photoDataId
        );
        let retrievedPhotoFileData =
          retrievedGalleryFormInputs[u][`childNodes`][2][`childNodes`][0][
            `childNodes`
          ][2][`files`][0];
        console[`log`]({ retrievedPhotoFileData });
        if (retrievedPhotoFileData) {
          if (retrievedPhotoFileData[`type`] === `image/jpeg`) {
            if (
              retrievedPhotoFileData[`name`][`includes`](`jpg`) &&
              !isNaN(
                Number(retrievedPhotoFileData[`name`][`replace`](`.jpg`, ``))
              )
            ) {
              const blobHold = retrievedPhotoFileData[`slice`](
                0,
                retrievedPhotoFileData[`size`],
                `image/jpeg`
              );
              retrievedPhotoFileData = new File(
                [blobHold],
                `nativeImage-${v4()}.jpg`,
                { [`type`]: `image/jpeg` }
              );
            } else if (
              retrievedPhotoFileData[`name`][`includes`](`jpeg`) &&
              !isNaN(
                Number(retrievedPhotoFileData[`name`][`replace`](`.jpeg`, ``))
              )
            ) {
              const blobHold = retrievedPhotoFileData[`slice`](
                0,
                retrievedPhotoFileData[`size`],
                `image/jpeg`
              );
              retrievedPhotoFileData = new File(
                [blobHold],
                `nativeImage-${v4()}.jpeg`,
                { [`type`]: `image/jpeg` }
              );
            }
          } else if (retrievedPhotoFileData[`type`] === `image/png`) {
            if (
              retrievedPhotoFileData[`name`][`includes`](`png`) &&
              !isNaN(
                Number(retrievedPhotoFileData[`name`][`replace`](`.png`, ``))
              )
            ) {
              const blobHold = retrievedPhotoFileData[`slice`](
                0,
                retrievedPhotoFileData[`size`],
                `image/png`
              );
              retrievedPhotoFileData = new File(
                [blobHold],
                `nativeImage-${v4()}.png`,
                { [`type`]: `image/png` }
              );
            }
          }
        }
        let retrievedPhotoPreviewData =
          galleryFormPreviewData[`${retrievedGalleryFormInputs[u][`id`]}`];
        console.log({
          retrievedPhotoFileData,
          retrievedPhotoPreviewData,
          retrievedStoreDataForPhoto,
        });
        if (IdeaId) {
          if (
            retrievedPhotoPreviewData[`photo`][`includes`](`blob`) ||
            retrievedPhotoPreviewData[`title`] !==
              retrievedStoreDataForPhoto?.title ||
            retrievedPhotoPreviewData[`filename`] !==
              retrievedStoreDataForPhoto?.filename
          ) {
            let conditionalFilenameConfig = retrievedPhotoPreviewData
              ? retrievedPhotoPreviewData[`photo`].replace(urlForPhotos, ``)
              : ``;
            console.log({ conditionalFilenameConfig });
            let photoDataConfigured = {
              [`id`]: retrievedPhotoPreviewData[`id`],
              [`title`]: retrievedPhotoPreviewData[`title`],
              [`references`]: retrievedPhotoPreviewData[`references`],
              [`filename`]: retrievedPhotoPreviewData[`photo`][`includes`](
                `blob`
              )
                ? undefined
                : conditionalFilenameConfig,
            };
            if (retrievedPhotoFileData) {
              galleryFormData[`append`](`photos`, retrievedPhotoFileData);
            }
            galleryDataHold[`push`](photoDataConfigured);
          }
        } else {
          let photoDataConfigured = {
            [`title`]: retrievedPhotoPreviewData[`title`],
            [`references`]: retrievedPhotoPreviewData[`references`],
          };
          galleryFormData[`append`](`photos`, retrievedPhotoFileData);
          galleryDataHold[`push`](photoDataConfigured);
        }
      }

      // Handle Checking of deleted photos
      let deletedPhotosIds: Array<string> = [];
      for (let c = 0; c < retrievedStoreDataForGallery.length; c++) {
        let verifiedPhotoForGallery = Object.keys(galleryFormPreviewData).find(
          (dataId: any) =>
            dataId[`replace`](`galleryPhotoData-`, ``) ===
            retrievedStoreDataForGallery[c][`id`]
        );

        if (
          !verifiedPhotoForGallery &&
          retrievedStoreDataForGallery[c] &&
          retrievedStoreDataForGallery[c][`id`] &&
          retrievedStoreDataForGallery[c][`id`] !== ``
        ) {
          deletedPhotosIds[`push`](retrievedStoreDataForGallery[c][`id`]);
        }

        console.log({ verifiedPhotoForGallery });
      }

      console.log({
        galleryDataHold,
        deletedPhotosIds,
      });

      const dataForMutation = {
        mutatedData: galleryDataHold,
        deletedPhotosIds: deletedPhotosIds,
      };

      const stringifiedGalleryData = IdeaId
        ? JSON[`stringify`](dataForMutation)
        : JSON[`stringify`](galleryDataHold);
      galleryFormData[`append`](`photosData`, stringifiedGalleryData);
      console[`log`]({
        galleryFormPhotos: galleryFormData[`getAll`](`photos`),
        galleryFormData: galleryFormData[`getAll`](`photosData`),
      });
      console[`log`](`heading towards gallery upload route`);
      const updatingDataBaseP2Gallery = await fetch(
        `${dataBaseUrl}${updatingDataBaseP1Id}/${
          IdeaId ? `full-mutation` : `add`
        }/gallery-photos`,
        {
          method: `PUT`,
          mode: `cors`,
          cache: `no-cache`,
          // headers: { [`Content-Type`]: `multipart/form-data` },
          body: galleryFormData,
        }
      ).then((res) => {
        const json = res.json();
        console[`log`]({ res, jsonForGalleryUpload: json });
        return json;
      });
      console.log({
        galleryInputsCheckP2: galleryDataHold,
        database: updatingDataBaseP2Gallery,
      });
    }

    if (
      formPreviewData[`current`][`data`][`passages`] &&
      Object.keys(formPreviewData[`current`][`data`][`passages`])[`length`] > 0
    ) {
      // Handle data upload for videos
      let journalDataHold: Array<{
        title: string;
        whatIsIt: string;
        content: string;
        humanRef: Array<string>;
        webRef: Array<string>;
      }> = [];

      for (let pD in formPreviewData[`current`][`data`][`passages`]) {
        let retrievedPassagePreviewData =
          formPreviewData[`current`][`data`][`passages`][pD];

        const configuredJSON = {
          title: retrievedPassagePreviewData[`title`],
          whatIsIt: retrievedPassagePreviewData[`whatIsIt`],
          content: retrievedPassagePreviewData[`content`],
          humanRef: [``],
          webRef: retrievedPassagePreviewData[`references`],
        };

        journalDataHold.push(configuredJSON);
        console.log({ pD, configuredJSON });
      }
      const stringifiedJournalData = JSON.stringify(journalDataHold);

      const updatingDataBaseP2Journal = await fetch(
        `${dataBaseUrl}${updatingDataBaseP1Id}/${
          IdeaId ? `full-mutation` : `add`
        }/journal-passages`,
        {
          method: `PUT`,
          mode: `cors`,
          cache: `no-cache`,
          headers: { [`Content-Type`]: `application/json` },
          body: stringifiedJournalData,
        }
      );
    }
    executeDataReset(false, false, true);
  };

  // Handle resetting of form and api display
  const executeDataReset = async (
    saveProjectPreviewData?: boolean,
    saveMediaDataIds?: boolean,
    saveMediaDatasElementNodes?: boolean
  ) => {
    const retrievedInputsElementForVideos = (storedRefs[`videosInputViewRef`][
      `current`
    ] as unknown) as HTMLDivElement;
    const retrievedInputsElementForGalleryPhotos = (storedRefs[
      `galleryPhotosInputViewRef`
    ][`current`] as unknown) as HTMLDivElement;
    const retrievedInputsElementForJournal = (storedRefs[
      `passagesInputViewRef`
    ][`current`] as unknown) as HTMLDivElement;

    setDataForForm(() => {
      return {
        forId: `DataAnnihilation`,
        forInput: `AllFormData`,
        inputValue: {},
      };
    });

    setMediaDataIds((previousMediaDataIds) => {
      return saveMediaDataIds
        ? { ...previousMediaDataIds }
        : {
            current: {
              video: ``,
              muralPhoto: ``,
              galleryPhoto: ``,
              passage: ``,
            },
          };
    });

    if (
      !saveMediaDatasElementNodes ||
      saveMediaDatasElementNodes === undefined
    ) {
      removeAllChildNodes(retrievedInputsElementForVideos);
      removeAllChildNodes(retrievedInputsElementForGalleryPhotos);
      removeAllChildNodes(retrievedInputsElementForJournal);
    }

    setInitialFormValues(() => {
      return {
        test: { title: `` },
        videos: {},
        muralPhotos: {},
        galleryPhotos: {},
        passages: {},
        etcs: {},
      };
    });

    setFormPreviewData((previousFormPreviewData) => {
      return {
        stored: saveProjectPreviewData
          ? { ...previousFormPreviewData[`stored`] }
          : {
              gallery: {},
              passages: {},
            },
        current: saveProjectPreviewData
          ? { ...previousFormPreviewData[`current`] }
          : {
              type: `apiFrontPage`,
              data: {},
            },
      };
    });
  };

  const backToApiFrontPage = () => {
    setStyles((styles) => {
      return {
        ...styles,
        innerFormDisplaySupport: {
          ...styles[`innerFormDisplaySupport`],
          borderWidth: 0,
          height: `0%`,
        },
        outterMediaPreviewDisplaySupport: {
          ...styles[`outterMediaPreviewDisplaySupport`],
          height: `${(Dimensions[`get`](`window`)[`height`] / 100) * 95}px`,
        },
      };
    });

    setFormPreviewDisplay(() => {
      return (
        <div className={styles.apiFrontPage}>
          <div
            className={styles.createNewIdeaButton}
            onClick={() => {
              removeAllChildNodes(storedRefs[`videosInputViewRef`][`current`]);
              removeAllChildNodes(
                storedRefs[`galleryPhotosInputViewRef`][`current`]
              );
              removeAllChildNodes(
                storedRefs[`passagesInputViewRef`][`current`]
              );
              createNewIdea();
            }}
          >{`CREATE NEW IDEA`}</div>
          {isAuthenticated ? (
            <div
              className={styles.browseIdeasForEditButton}
              onClick={async () => {
                console[`log`](
                  `clicking for browsing of personal database projects`
                );
                removeAllChildNodes(
                  storedRefs[`videosInputViewRef`][`current`]
                );
                removeAllChildNodes(
                  storedRefs[`galleryPhotosInputViewRef`][`current`]
                );
                removeAllChildNodes(
                  storedRefs[`passagesInputViewRef`][`current`]
                );
                let forStorage = { gallery: {}, passages: {} };
                let allVideosData = {};
                let allGalleryData = {};
                let allJournalData = {};
                let consolidatedData = {};
                let dataBaseProjectIds: Array<string> = [];
                let configuredId = { id: ``, index: -1 };

                const handleRetrievalOfProjectData = async () => {
                  const allCurrentDatabaseProjectsIds = await retrieveAllProjectsIds(
                    {
                      [`userId`]: authorizationStatus[`authorizedId`],
                      [`accessPower`]: authorizationStatus[`personalAccess`],
                    }
                  );
                  const retrievedProjectData = projectDataFetch(
                    allCurrentDatabaseProjectsIds[0]
                  );
                  dataBaseProjectIds = allCurrentDatabaseProjectsIds;
                  return retrievedProjectData;
                };
                const fetchedProjectData = await handleRetrievalOfProjectData();
                const retrievedFullData =
                  fetchedProjectData[`projectData`][`fullData`];
                retrievedFullData[`motionPictures`][`forEach`]((data) => {
                  allVideosData = {
                    ...allVideosData,
                    [`videoData-${data._id}`]: {
                      id: data._id,
                      name: data.videoName,
                      type: data.videoType,
                      url: data.videoUrl,
                    },
                  };
                });
                retrievedFullData[`majorCatalogPhotos`][`forEach`]((data) => {
                  forStorage = {
                    ...forStorage,
                    [`gallery`]: {
                      ...forStorage[`gallery`],
                      [`galleryPhotoData-${data._id}`]: {
                        url: `${dataBaseUrl}photos/${data.photoFilename}`,
                      },
                    },
                  };
                  allGalleryData = {
                    ...allGalleryData,
                    [`galleryPhotoData-${data._id}`]: {
                      id: data._id,
                      title: data.photoTitle,
                      references: data.photoReferences,
                      photo: `${dataBaseUrl}photos/${data.photoFilename}`,
                    },
                  };
                });
                retrievedFullData[`journal`][`forEach`]((data) => {
                  forStorage = {
                    ...forStorage,
                    [`passages`]: {
                      ...forStorage[`passages`],
                      [`passageData-${data._id}`]: { content: data[`content`] },
                    },
                  };
                  allJournalData = {
                    ...allJournalData,
                    [`passageData-${data._id}`]: {
                      id: data._id,
                      title: data.title,
                      whatIsIt: data.whatIsIt,
                      content: data.content,
                      references: data.references.web,
                    },
                  };
                });
                consolidatedData = {
                  ...consolidatedData,
                  [`test`]: { [`title`]: retrievedFullData[`ideaTitle`] },
                  [`videos`]: allVideosData,
                  [`galleryPhotos`]: allGalleryData,
                  [`passages`]: allJournalData,
                };
                configuredId = {
                  [`id`]: retrievedFullData[`_id`],
                  [`index`]: 0,
                };
                setMediaDataIds((previousMediaDataIds) => {
                  return {
                    ...previousMediaDataIds,
                    [`dataBaseProjectIds`]: dataBaseProjectIds,
                    [`current`]: {
                      ...previousMediaDataIds[`current`],
                      [`fetchedProject`]: configuredId,
                    },
                  };
                });
                setFormPreviewData((previousFormPreviewData) => {
                  return {
                    ...previousFormPreviewData,
                    [`stored`]: forStorage,
                    [`current`]: {
                      [`type`]: `viewExistingProject`,
                      [`data`]: consolidatedData,
                    },
                  };
                });
                console.log({
                  fetchedProjectData,
                  consolidatedData,
                  configuredId,
                });
              }}
            >{`BROWSE IDEAS TO EDIT`}</div>
          ) : (
            <></>
          )}
        </div>
      );
    });
  };

  // Declare function handling finalized idea database upload
  const handleDataBaseUpload = async (forFetchedProject: boolean) => {
    console.log({ formPreviewData, storedRefs });
    await updateTheDataBase(
      forFetchedProject ? true : false,
      forFetchedProject
        ? mediaDataIds[`current`][`fetchedProject`]
          ? mediaDataIds[`current`][`fetchedProject`][`id`]
          : undefined
        : undefined
    ).then(() => {
      backToApiFrontPage();
    });
  };

  // Handle update of preview display
  React.useEffect(() => {
    console.log({ formPreviewData, mediaDataIds, authorizationStatus });
    if (
      isAuthenticated &&
      formPreviewData[`current`][`type`] === `apiFrontPage`
    ) {
      setFormPreviewDisplay((prevFormPreviewDisplay) => {
        return (
          <div className={styles.apiFrontPage}>
            <div
              className={styles.createNewIdeaButton}
              onClick={() => {
                createNewIdea();
              }}
            >{`CREATE NEW IDEA`}</div>
            <div
              className={styles.browseIdeasForEditButton}
              onClick={async (event) => {
                event[`persist`]();
                const eventTyped = (event as unknown) as React.ChangeEvent<HTMLDivElement>;
                console[`log`]({ event });
                console[`log`](`fetching projects for user`);
                let forStorage = { gallery: {}, passages: {} };
                let allVideosData = {};
                let allGalleryData = {};
                let allJournalData = {};
                let consolidatedData = {};
                let dataBaseProjectIds: Array<string> = [];
                let configuredId = { id: ``, index: -1 };

                console[`log`]({ authorizationStatus });
                const allCurrentDatabaseProjectsIds = await retrieveAllProjectsIds(
                  {
                    [`userId`]: authorizationStatus[`authorizedId`],
                    [`accessPower`]: authorizationStatus[`personalAccess`],
                  }
                );
                console[`log`]({ allCurrentDatabaseProjectsIds });
                if (
                  allCurrentDatabaseProjectsIds &&
                  allCurrentDatabaseProjectsIds[`length`] > 0
                ) {
                  const handleRetrievalOfProjectData = async () => {
                    const retrievedProjectData = projectDataFetch(
                      allCurrentDatabaseProjectsIds[0]
                    );
                    dataBaseProjectIds = allCurrentDatabaseProjectsIds;
                    return retrievedProjectData;
                  };
                  const fetchedProjectData = await handleRetrievalOfProjectData();
                  const retrievedFullData =
                    fetchedProjectData[`projectData`][`fullData`];
                  retrievedFullData[`motionPictures`][`forEach`]((data) => {
                    allVideosData = {
                      ...allVideosData,
                      [`videoData-${data._id}`]: {
                        id: data._id,
                        name: data.videoName,
                        type: data.videoType,
                        url: data.videoUrl,
                      },
                    };
                  });
                  retrievedFullData[`majorCatalogPhotos`][`forEach`]((data) => {
                    forStorage = {
                      ...forStorage,
                      [`gallery`]: {
                        ...forStorage[`gallery`],
                        [`galleryPhotoData-${data._id}`]: {
                          url: `${dataBaseUrl}photos/${data.photoFilename}`,
                        },
                      },
                    };
                    allGalleryData = {
                      ...allGalleryData,
                      [`galleryPhotoData-${data._id}`]: {
                        id: data._id,
                        title: data.photoTitle,
                        references: data.photoReferences,
                        photo: `${dataBaseUrl}photos/${data.photoFilename}`,
                      },
                    };
                  });
                  retrievedFullData[`journal`][`forEach`]((data) => {
                    forStorage = {
                      ...forStorage,
                      [`passages`]: {
                        ...forStorage[`passages`],
                        [`passageData-${data._id}`]: {
                          content: data[`content`],
                        },
                      },
                    };
                    allJournalData = {
                      ...allJournalData,
                      [`passageData-${data._id}`]: {
                        id: data._id,
                        title: data.title,
                        whatIsIt: data.whatIsIt,
                        content: data.content,
                        references: data.references.web,
                      },
                    };
                  });
                  consolidatedData = {
                    ...consolidatedData,
                    [`test`]: { [`title`]: retrievedFullData[`ideaTitle`] },
                    [`videos`]: allVideosData,
                    [`galleryPhotos`]: allGalleryData,
                    [`passages`]: allJournalData,
                  };
                  configuredId = {
                    [`id`]: retrievedFullData[`_id`],
                    [`index`]: 0,
                  };
                  setMediaDataIds((previousMediaDataIds) => {
                    return {
                      ...previousMediaDataIds,
                      [`dataBaseProjectIds`]: dataBaseProjectIds,
                      [`current`]: {
                        ...previousMediaDataIds[`current`],
                        [`fetchedProject`]: configuredId,
                      },
                    };
                  });
                  setFormPreviewData((previousFormPreviewData) => {
                    return {
                      ...previousFormPreviewData,
                      [`stored`]: forStorage,
                      [`current`]: {
                        [`type`]: `viewExistingProject`,
                        [`data`]: consolidatedData,
                      },
                    };
                  });
                  console.log({
                    fetchedProjectData,
                    consolidatedData,
                    configuredId,
                  });
                } else {
                  eventTyped[`target`][`innerHTML`] = `NO PROJECTS FOR EDITING`;
                }
              }}
            >{`BROWSE IDEAS TO EDIT`}</div>
          </div>
        );
      });
    } else if (formPreviewData[`current`][`type`] === `video`) {
      setFormPreviewDisplay(() => {
        return (
          <div className={styles.innerMediaPreviewDisplay}>
            <ReactPlayer
              width={"100%"}
              height={"100%"}
              controls
              url={
                formPreviewData[`current`][`data`] &&
                formPreviewData[`current`][`data`][`url`]
                  ? formPreviewData[`current`][`data`][`url`]
                  : undefined
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
    } else if (formPreviewData[`current`][`type`] === `galleryPhoto`) {
      let verifiedPhotoSource = ``;
      if (
        formPreviewData[`current`][`data`] &&
        formPreviewData[`current`][`data`][`photo`]
      ) {
        verifiedPhotoSource = formPreviewData[`current`][`data`][`photo`];
      } else if (
        formPreviewData[`stored`][`gallery`] &&
        formPreviewData[`stored`][`gallery`][
          mediaDataIds[`current`][`galleryPhoto`]
        ]
      ) {
        verifiedPhotoSource =
          formPreviewData[`stored`][`gallery`][
            mediaDataIds[`current`][`galleryPhoto`]
          ][`url`];
      }

      setFormPreviewDisplay(() => {
        return (
          <div className={styles.innerMediaPreviewDisplay}>
            <img
              className={styles.previewDisplayImage}
              width={`100%`}
              height={`100%`}
              src={verifiedPhotoSource}
              alt={`preview`}
            />
          </div>
        );
      });
    } else if (formPreviewData[`current`][`type`] === `passage`) {
      setFormPreviewDisplay((previousPreviewDisplay) => {
        // Create react class element for passage preview
        const textInputArea = React.createElement("textarea", {
          className: styles.passageContentText,
          value:
            mediaDataIds[`current`][`passage`] !== `` &&
            formPreviewData[`stored`][`passages`][
              mediaDataIds[`current`][`passage`]
            ] &&
            formPreviewData[`stored`][`passages`][
              mediaDataIds[`current`][`passage`]
            ][`content`]
              ? formPreviewData[`stored`][`passages`][
                  mediaDataIds[`current`][`passage`]
                ][`content`]
              : ``,
          onChange: (event) => {
            event[`persist`]();
            const eventTyped = (event as unknown) as React.ChangeEvent<HTMLTextAreaElement>;
            const retrievedText = eventTyped[`currentTarget`][`value`];
            setDataForForm((previousDataForForm) => {
              return {
                ...previousDataForForm,
                forId: `forStorage-${mediaDataIds[`current`][`passage`]}`,
                forInput: `content`,
                inputValue: retrievedText,
              };
            });
          },
        });
        const PassagePreview = React.createElement(
          "div",
          { className: styles.innerMediaPreviewDisplay },
          textInputArea
        );

        return PassagePreview;
      });
    }
    if (
      formPreviewData[`current`][`type`] === `allNewData` ||
      formPreviewData[`current`][`type`] === `reCheck` ||
      formPreviewData[`current`][`type`] === `viewExistingProject`
    ) {
      console.log({ allNewData: formPreviewData[`current`][`data`] });
      let dataForVideos = [];
      let dataForGallery = [];
      let dataForJournal = [];

      const optionsBar =
        formPreviewData[`current`][`type`] === `viewExistingProject` ? (
          <div className={styles.retrievedProjectOptions}>
            <div
              className={styles.backToApiFrontPageButton}
              onClick={() => {
                backToApiFrontPage();
                executeDataReset();
              }}
            >{`BACK`}</div>
            <div className={styles.projectsNavigationBar}>
              <div
                className={styles.projectsNavigationPrevious}
                onClick={() => {
                  retrievePreviousFetchedProject();
                }}
              >{`PREV`}</div>
              <div
                className={styles.projectsNavigationNext}
                onClick={() => {
                  retrieveNextFetchedProject();
                }}
              >{`NEXT`}</div>
            </div>
            <div
              className={styles.editFetchedProjectButton}
              onClick={() => {
                console.log({ formPreviewData });
                setDataForForm(() => {
                  return {
                    forId: `fetchedProjectData`,
                    forInput: `AllFormInputs`,
                    inputValue: {
                      ...formPreviewData[`current`][`data`],
                      resetData: executeDataReset,
                    },
                  };
                });
              }}
            >{`EDIT PROJECT`}</div>
            <div
              ref={destroyProjectButtonRef}
              className={styles.destroyProjectButton}
              onClick={async (event) => {
                const innerHtml = event.currentTarget.innerHTML;
                console.log({ innerHtml });
                if (innerHtml === `DESTROY PROJECT`) {
                  event.currentTarget.innerHTML = `ARE YOU CERTAIN?`;
                  event.currentTarget.style.color = `gainsboro`;
                  event.currentTarget.style.borderColor = `gainsboro`;
                  event.currentTarget.style.backgroundColor = `maroon`;
                  setTimeout(() => {
                    if (destroyProjectButtonRef[`current`]) {
                      destroyProjectButtonRef.current.innerHTML = `DESTROY PROJECT`;
                      destroyProjectButtonRef.current.style.color = ``;
                      destroyProjectButtonRef.current.style.borderColor = ``;
                      destroyProjectButtonRef.current.style.backgroundColor = ``;
                    }
                  }, 10000);
                } else if (innerHtml === `ARE YOU CERTAIN?`) {
                  console.log({
                    mediaDataIds: mediaDataIds[`current`][`fetchedProject`]?.id,
                  });
                  await fetch(
                    `${dataBaseUrl}${
                      mediaDataIds[`current`][`fetchedProject`]?.id
                    }/destroy`,
                    {
                      method: `DELETE`,
                      mode: `cors`,
                      cache: `no-cache`,
                    }
                  );
                  await fetch(
                    `${userBaseUrl}updateDataAccess/${
                      authorizationStatus[`authorizedId`]
                    }/webApp/AnIdea/operationMode/remove`,
                    {
                      method: `PUT`,
                      mode: `cors`,
                      cache: `no-cache`,
                      // credentials: `same-origin`,
                      headers: { [`Content-Type`]: `application/json` },
                      body: JSON[`stringify`]({
                        [`projectId`]: mediaDataIds[`current`][`fetchedProject`]
                          ?.id,
                      }),
                    }
                  );
                  setMediaDataIds((previousMediaDataIds) => {
                    let copyOfIds = { ...previousMediaDataIds };
                    let copyOfDatabaseIds = copyOfIds[`dataBaseProjectIds`]
                      ? [...copyOfIds[`dataBaseProjectIds`]]
                      : [];
                    let indexOfdeletedId = copyOfDatabaseIds.findIndex(
                      (id) =>
                        mediaDataIds[`current`][`fetchedProject`]?.id === id
                    );

                    if (indexOfdeletedId || indexOfdeletedId === 0) {
                      if (indexOfdeletedId === 0) {
                        console.log(`deleting at index 0`);
                        copyOfDatabaseIds.shift();
                      } else {
                        copyOfDatabaseIds.splice(indexOfdeletedId, 1);
                      }
                    }

                    copyOfIds = {
                      ...copyOfIds,
                      [`dataBaseProjectIds`]: copyOfDatabaseIds,
                    };

                    console.log({
                      copyOfIds,
                      copyOfDatabaseIds,
                      indexOfdeletedId,
                    });
                    if (copyOfDatabaseIds[`length`] > 0) {
                      retrievePreviousFetchedProject(true, copyOfIds);
                    } else {
                      setFormPreviewData((prevFormPreviewData) => {
                        return {
                          ...prevFormPreviewData,
                          [`current`]: {
                            ...prevFormPreviewData[`current`],
                            [`type`]: `apiFrontPage`,
                          },
                        };
                      });
                    }
                    return copyOfIds;
                  });
                  if (destroyProjectButtonRef[`current`]) {
                    destroyProjectButtonRef.current.innerHTML = `DESTROY PROJECT`;
                    destroyProjectButtonRef.current.style.color = ``;
                    destroyProjectButtonRef.current.style.borderColor = ``;
                    destroyProjectButtonRef.current.style.backgroundColor = ``;
                  }
                }
              }}
            >{`DESTROY PROJECT`}</div>
          </div>
        ) : (
          <div className={styles.finalizeOptions}>
            <div
              className={styles.returnToEditButton}
              onClick={() => {
                setFormPreviewData((previousFormPreviewData) => {
                  return {
                    ...previousFormPreviewData,
                    [`current`]: {
                      ...previousFormPreviewData[`current`],
                      [`type`]: `backToEditing`,
                    },
                  };
                });
                setFormPreviewDisplay(() => {
                  return (
                    <div className={styles.innerMediaPreviewDisplay}>
                      {`BACK TO EDITING`}
                    </div>
                  );
                });
                setStyles((previousStyles) => {
                  return {
                    ...previousStyles,
                    [`innerFormDisplaySupport`]: {
                      ...previousStyles[`innerFormDisplaySupport`],
                      height: `${(screenHeight / 100) * 15 - 2}px`,
                      borderWidth: 2,
                    },
                    [`outterMediaPreviewDisplaySupport`]: {
                      ...previousStyles[`outterMediaPreviewDisplaySupport`],
                      height: `${(screenHeight / 100) * 80}px`,
                    },
                  };
                });
              }}
            >{`BACK TO EDITING`}</div>
            <div
              className={styles.finalizeDataButton}
              onClick={(event) => {
                confirmDataBaseUpload(
                  mediaDataIds[`current`][`fetchedProject`] &&
                    mediaDataIds[`current`][`fetchedProject`][`id`]
                    ? true
                    : false
                );
              }}
            >
              {mediaDataIds[`dataBaseProjectIds`] &&
              mediaDataIds[`dataBaseProjectIds`][`find`](
                (dataBaseProjectId) =>
                  mediaDataIds[`current`][`fetchedProject`] &&
                  dataBaseProjectId ===
                    mediaDataIds[`current`][`fetchedProject`][`id`]
              )
                ? `UPDATE IDEA TO DATABASE`
                : `UPLOAD NEW IDEA TO DATABASE`}
            </div>
          </div>
        );

      for (let v in formPreviewData[`current`][`data`][`videos`]) {
        let configgedVideoView = (
          <div
            key={v}
            id={v}
            className={styles.finalVideoPreview}
            onMouseOver={(event) => {
              const eventTyped = (event as unknown) as React.ChangeEvent<HTMLDivElement>;
              const childNodesRetrieved = (finalVideosMediaPreviewsRef[
                `current`
              ][`childNodes`] as unknown) as Array<HTMLDivElement>;
              let foundElement = ((<div></div>) as unknown) as HTMLDivElement;
              for (let y = 0; y < childNodesRetrieved[`length`]; y++) {
                if (childNodesRetrieved[y][`id`][`includes`](v)) {
                  foundElement = childNodesRetrieved[y];
                }
              }
              const retrievedExtendedDataElement = (foundElement[
                `childNodes`
              ][1] as unknown) as HTMLDivElement;
              foundElement[`style`][`width`] = `58%`;
              retrievedExtendedDataElement[`style`][`display`] = `flex`;
            }}
            onMouseOut={(event) => {
              const eventTyped = (event as unknown) as React.ChangeEvent<HTMLDivElement>;
              const childNodesRetrieved = (finalVideosMediaPreviewsRef[
                `current`
              ][`childNodes`] as unknown) as Array<HTMLDivElement>;
              let foundElement = ((<div></div>) as unknown) as HTMLDivElement;
              for (let y = 0; y < childNodesRetrieved[`length`]; y++) {
                if (childNodesRetrieved[y][`id`][`includes`](v)) {
                  foundElement = childNodesRetrieved[y];
                }
              }
              const retrievedExtendedDataElement = (foundElement[
                `childNodes`
              ][1] as unknown) as HTMLDivElement;
              foundElement[`style`][`width`] = `29%`;
              retrievedExtendedDataElement[`style`][`display`] = `none`;
            }}
          >
            <ReactPlayer
              width={"100%"}
              height={"100%"}
              controls
              url={formPreviewData[`current`][`data`][`videos`][v][`url`]}
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
            <div className={styles.finalVideoExtendedDataPreview}>
              <div className={styles.finalVideoName}>{`Name:   ${
                formPreviewData[`current`][`data`][`videos`][v][`name`]
              }`}</div>
              <div className={styles.finalVideoType}>{`Type:   ${
                formPreviewData[`current`][`data`][`videos`][v][`type`]
              }`}</div>
            </div>
          </div>
        );
        dataForVideos.push(configgedVideoView);
      }
      for (let gP in formPreviewData[`current`][`data`][`galleryPhotos`]) {
        let configgedPhotoView = (
          <div
            key={gP}
            id={gP}
            className={styles.finalPhotoPreview}
            onMouseOver={(event) => {
              const eventTyped = (event as unknown) as React.ChangeEvent<HTMLDivElement>;
              const childNodesRetrieved = (finalGalleryPhotosMediaPreviewsRef[
                `current`
              ][`childNodes`] as unknown) as Array<HTMLDivElement>;
              let foundElement = ((<div></div>) as unknown) as HTMLDivElement;
              for (let y = 0; y < childNodesRetrieved[`length`]; y++) {
                if (childNodesRetrieved[y][`id`][`includes`](gP)) {
                  foundElement = childNodesRetrieved[y];
                }
              }
              const retrievedImageDataElement = (foundElement[
                `childNodes`
              ][0] as unknown) as HTMLImageElement;
              const retrievedExtendedDataElement = (foundElement[
                `childNodes`
              ][1] as unknown) as HTMLDivElement;
              foundElement[`style`][`width`] = `58%`;
              retrievedExtendedDataElement[`style`][`display`] = `flex`;
              retrievedImageDataElement[`style`][`width`] = `50%`;
            }}
            onMouseOut={(event) => {
              const eventTyped = (event as unknown) as React.ChangeEvent<HTMLDivElement>;
              const childNodesRetrieved = (finalGalleryPhotosMediaPreviewsRef[
                `current`
              ][`childNodes`] as unknown) as Array<HTMLDivElement>;
              let foundElement = ((<div></div>) as unknown) as HTMLDivElement;
              for (let y = 0; y < childNodesRetrieved[`length`]; y++) {
                if (childNodesRetrieved[y][`id`][`includes`](gP)) {
                  foundElement = childNodesRetrieved[y];
                }
              }
              const retrievedImageDataElement = (foundElement[
                `childNodes`
              ][0] as unknown) as HTMLImageElement;
              const retrievedExtendedDataElement = (foundElement[
                `childNodes`
              ][1] as unknown) as HTMLDivElement;
              foundElement[`style`][`width`] = `29%`;
              retrievedExtendedDataElement[`style`][`display`] = `none`;
              retrievedImageDataElement[`style`][`width`] = `100%`;
            }}
          >
            <img
              className={styles.previewDisplayImage}
              src={
                formPreviewData[`current`][`data`][`galleryPhotos`][gP][`photo`]
              }
              alt={`preview`}
            />
            <div className={styles.finalPhotoExtendedData}>
              <div className={styles.finalPhotoTitle}>{`Title:   ${
                formPreviewData[`current`][`data`][`galleryPhotos`][gP][`title`]
              }`}</div>
              <div className={styles.finalPhotoReferences}>
                {`References:   `}
                {formPreviewData[`current`][`data`][`galleryPhotos`][gP][
                  `references`
                ][`map`]((reference: string) => reference)}
              </div>
            </div>
          </div>
        );
        dataForGallery.push(configgedPhotoView);
      }
      for (let p in formPreviewData[`current`][`data`][`passages`]) {
        let configgedPassageView = (
          <div
            key={p}
            id={p}
            className={styles.finalPassagePreview}
            onMouseOver={(event) => {
              const eventTyped = (event as unknown) as React.ChangeEvent<HTMLDivElement>;
              const childNodesRetrieved = (finalJournalMediaPreviewsRef[
                `current`
              ][`childNodes`] as unknown) as Array<HTMLDivElement>;
              let foundElement = ((<div></div>) as unknown) as HTMLDivElement;
              for (let y = 0; y < childNodesRetrieved[`length`]; y++) {
                if (childNodesRetrieved[y][`id`][`includes`](p)) {
                  foundElement = childNodesRetrieved[y];
                }
              }
              const retrievedContentDataElement = (foundElement[
                `childNodes`
              ][0] as unknown) as HTMLDivElement;
              const retrievedExtendedDataElement = (foundElement[
                `childNodes`
              ][1] as unknown) as HTMLDivElement;
              foundElement[`style`][`width`] = `58%`;
              retrievedContentDataElement[`style`][`width`] = `50%`;
              retrievedExtendedDataElement[`style`][`display`] = `flex`;
            }}
            onMouseOut={(event) => {
              const eventTyped = (event as unknown) as React.ChangeEvent<HTMLDivElement>;
              const childNodesRetrieved = (finalJournalMediaPreviewsRef[
                `current`
              ][`childNodes`] as unknown) as Array<HTMLDivElement>;
              let foundElement = ((<div></div>) as unknown) as HTMLDivElement;
              for (let y = 0; y < childNodesRetrieved[`length`]; y++) {
                if (childNodesRetrieved[y][`id`][`includes`](p)) {
                  foundElement = childNodesRetrieved[y];
                }
              }
              const retrievedContentDataElement = (foundElement[
                `childNodes`
              ][0] as unknown) as HTMLDivElement;
              const retrievedExtendedDataElement = (foundElement[
                `childNodes`
              ][1] as unknown) as HTMLDivElement;
              foundElement[`style`][`width`] = `29%`;
              retrievedContentDataElement[`style`][`width`] = `100%`;
              retrievedExtendedDataElement[`style`][`display`] = `none`;
            }}
          >
            <div className={styles.finalPassageContentPreview}>
              {formPreviewData[`current`][`data`][`passages`][p][`content`]}
            </div>
            <div className={styles.finalPassageExtendedDataPreview}>
              <div className={styles.finalPassageTitlePreview}>
                {`Title:   `}
                {formPreviewData[`current`][`data`][`passages`][p][`title`]}
              </div>
              <div className={styles.finalPassageWhatIsItPreview}>
                {`WhatIsIt:   `}
                {formPreviewData[`current`][`data`][`passages`][p][`whatIsIt`]}
              </div>
              <div className={styles.finalPassageReferencesPreview}>
                {`References:   `}
                {formPreviewData[`current`][`data`][`passages`][p][
                  `references`
                ][`map`]((reference: string) => reference)}
              </div>
            </div>
          </div>
        );
        dataForJournal.push(configgedPassageView);
      }
      const mediaPreviewsConsolidated = (
        <div
          id={`consolidatedMediaView`}
          className={styles.finalInnerMediaPreviewDisplay}
        >
          <div className={styles.finalIdeaTitle}>
            {formPreviewData[`current`][`data`][`test`][`title`]}
          </div>
          <div
            ref={finalVideosMediaPreviewsRef}
            className={styles.finalMediaPreviewsConsolidated}
          >
            {dataForVideos.map((videoView) => videoView)}
          </div>
          <div
            ref={finalGalleryPhotosMediaPreviewsRef}
            className={styles.finalMediaPreviewsConsolidated}
          >
            {dataForGallery.map((photoView) => photoView)}
          </div>
          <div
            ref={finalJournalMediaPreviewsRef}
            className={styles.finalMediaPreviewsConsolidated}
          >
            {dataForJournal.map((passageView) => passageView)}
          </div>
          {optionsBar}
        </div>
      );
      setStyles((styles) => {
        return {
          ...styles,
          innerFormDisplaySupport: {
            ...styles[`innerFormDisplaySupport`],
            height: `0px`,
            borderWidth: 0,
          },
          outterMediaPreviewDisplaySupport: {
            ...styles[`outterMediaPreviewDisplaySupport`],
            height: `${(Dimensions[`get`](`window`)[`height`] / 100) * 95}px`,
          },
        };
      });
      setFormPreviewDisplay(() => {
        return mediaPreviewsConsolidated;
      });
    } else if (
      formPreviewData[`current`][`type`] === `formFilledForFetchedProject`
    ) {
      setStyles((previousStyles) => {
        return {
          ...previousStyles,
          innerFormDisplaySupport: {
            ...previousStyles[`innerFormDisplaySupport`],
            height: `${(screenHeight / 100) * 15 - 2}px`,
            borderWidth: 2,
          },
          outterMediaPreviewDisplaySupport: {
            ...previousStyles[`outterMediaPreviewDisplaySupport`],
            height: `${(screenHeight / 100) * 80}px`,
          },
        };
      });
      setFormPreviewDisplay(() => {
        return (
          <div
            className={styles.innerMediaPreviewDisplay}
          >{`RETRIEVED PROJECT READY FOR EDIT`}</div>
        );
      });
    }
  }, [formPreviewData, authorizationStatus]);

  // Handle processes for media ids updates
  React.useEffect(() => {
    if (formPreviewData[`current`][`type`] === `passage`) {
      console.log(`updating passage preview due to media id change`, {
        currentPassageId: mediaDataIds[`current`][`passage`],
        passages: formPreviewData[`stored`][`passages`],
        passage:
          formPreviewData[`stored`][`passages`][
            mediaDataIds[`current`][`passage`]
          ] &&
          formPreviewData[`stored`][`passages`][
            mediaDataIds[`current`][`passage`]
          ][`content`]
            ? formPreviewData[`stored`][`passages`][
                mediaDataIds[`current`][`passage`]
              ][`content`]
            : ``,
      });
      setFormPreviewDisplay((previousPreviewDisplay) => {
        // Create react class element for passage preview
        console.log({ formPreviewDataForPassages: formPreviewData });
        const textInputArea = React.createElement("textarea", {
          className: styles.passageContentText,
          value:
            formPreviewData[`stored`][`passages`][
              mediaDataIds[`current`][`passage`]
            ] &&
            formPreviewData[`stored`][`passages`][
              mediaDataIds[`current`][`passage`]
            ][`content`]
              ? formPreviewData[`stored`][`passages`][
                  mediaDataIds[`current`][`passage`]
                ][`content`]
              : ``,
          onChange: (event) => {
            event[`persist`]();
            const eventTyped = (event as unknown) as React.ChangeEvent<HTMLTextAreaElement>;
            const retrievedText = eventTyped[`currentTarget`][`value`];
            setDataForForm((previousDataForForm) => {
              return {
                ...previousDataForForm,
                forId: `forStorage-${mediaDataIds[`current`][`passage`]}`,
                forInput: `content`,
                inputValue: retrievedText,
              };
            });
          },
        });
        const PassagePreview = React.createElement(
          "div",
          { className: styles.innerMediaPreviewDisplay },
          textInputArea
        );

        return PassagePreview;
      });
    }
  }, [mediaDataIds]);

  // Handle function component return view
  return (
    <div
      className={styles.mainDisplaySupportClass}
      style={styles.mainDisplaySupportStyle}
    >
      <div
        className={styles[`headerBarForAPI`]}
        style={styles[`headerBarForAPISupport`]}
      >
        <HeaderBar
          authorizationStatusOpts={{
            authorizationStatus,
            setAuthorizationStatus,
          }}
        />
      </div>
      <div
        className={styles.outterMediaPreviewDisplay}
        style={styles.outterMediaPreviewDisplaySupport}
      >
        {formPreviewDisplay}
      </div>
      <FormConfiguration
        styles={styles}
        customInitialFormValues={{
          initialFormValues: initialFormValues,
          setInitialFormValues: setInitialFormValues,
        }}
        ids={{ mediaDataIds, setMediaDataIds }}
        formFacade={{
          initialInputs: [{ name: `title`, inputType: `text` }],
          mediaInputsNav: [
            { mediaType: `video`, buttonText: `Vids` },
            { mediaType: `galleryPhoto`, buttonText: `Gallery` },
            { mediaType: `passage`, buttonText: `Passages` },
          ],
          mediaMiniFormInputs: [
            {
              mediaType: `video`,
              addButtonText: `Add Video`,
              inputsOpts: [
                { key: `name`, typeOfInput: `textInput` },
                { key: `url`, typeOfInput: `textInput` },
                {
                  key: `type`,
                  typeOfInput: `listInput`,
                  childrenElements: [`youtube`, `not listed`],
                },
              ],
              inputsDeletionCallback: () => {
                return { name: ``, url: ``, type: `` };
              },
            },
            {
              mediaType: `galleryPhoto`,
              addButtonText: `Add Gallery Photo`,
              inputsOpts: [
                { key: `photo`, typeOfInput: `fileInput` },
                { key: `title`, typeOfInput: `textInput` },
                {
                  key: `reference`,
                  typeOfInput: `textInputWithSubIndex`,
                },
              ],
              inputsDeletionCallback: () => {
                return { title: ``, photo: `reset`, references: [``] };
              },
            },
            {
              mediaType: `passage`,
              addButtonText: `Add Passage`,
              inputsOpts: [
                { key: `title`, typeOfInput: `textInput` },
                { key: `whatIsIt`, typeOfInput: `textInput` },
                { key: `content`, typeOfInput: `` },
                {
                  key: `reference`,
                  typeOfInput: `textInputWithSubIndex`,
                },
              ],
              inputsDeletionCallback: () => {
                return {
                  title: ``,
                  whatIsIt: ``,
                  content: ``,
                  references: [``],
                };
              },
            },
          ],
        }}
        formPreviewDataOpts={{ formPreviewData, setFormPreviewData }}
        customFormSchema={{
          validSchema: validSchema,
          setValidSchema: setValidSchema,
        }}
        storedRefs={storedRefs}
        dataForForm={dataForForm}
      />
    </div>
  );
};

const styles2 = StyleSheet.create({
  mainDisplay: {
    flexDirection: `row`,
    justifyContent: "center",
    alignItems: "stretch",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
});

export default API;

/**  Another window resize suggestion
 * <canvas
 * width={window.innerWidth}
 * height={window.innerHeight}
 * ></canvas
 * */
