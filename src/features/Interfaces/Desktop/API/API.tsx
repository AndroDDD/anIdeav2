import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useFormik } from "formik";
import * as yup from "yup";
import ReactPlayer from "react-player";

import { v4 } from "uuid";
import $ from "jquery";

import {
  projectDataFetch,
  retrieveAllProjectsIds,
} from "../../../Data/ProjectSlice";

import "./APIStyles.scss";
import { dataBaseUrl, localUrl, store } from "../../../../routes/routerBlock";

interface FormConfigurationInterface {
  styles: any;
  customInitialFormValues: {
    initialFormValues: any;
    setInitialFormValues: Function;
  };
  ids: {
    mediaDataIds: {
      current: {
        video: string | number;
        muralPhoto: string | number;
        galleryPhoto: string | number;
        passage: string | number;
      };
    };
    setMediaDataIds: React.Dispatch<
      React.SetStateAction<{
        current: {
          video: string | number;
          muralPhoto: string | number;
          galleryPhoto: string | number;
          passage: string | number;
        };
      }>
    >;
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
  formPreviewDataOpts,
  customFormSchema,
  storedRefs,
  dataForForm,
}) => {
  // Destructure incoming props
  const { initialFormValues } = customInitialFormValues;
  const { validSchema, setValidSchema } = customFormSchema;
  const { mediaDataIds, setMediaDataIds } = ids;
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
    initialInputValue?: any
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
        let allRetrievedReferences = (eventTyped.target.parentNode?.parentNode
          ?.childNodes as unknown) as Array<HTMLDivElement>;
        let allRetrievedReferencesConverted = Array.prototype.slice.call(
          allRetrievedReferences
        );

        let retrievedElementIndex = allRetrievedReferencesConverted.findIndex(
          (element) =>
            element.id ===
            `${mediaType}-${mediaKeyRef}-${dataKeyRefId}-subId-${generatedSubId}`
        );

        let retrievedPreviousFormValuesForReferences: Array<string> = [];
        for (let i = 0; i < allRetrievedReferencesConverted.length; i++) {
          retrievedPreviousFormValuesForReferences.push(
            allRetrievedReferencesConverted[i].childNodes[2][`value`]
          );
        }

        if (retrievedElementIndex && retrievedElementIndex > 0) {
          retrievedPreviousFormValuesForReferences.splice(
            retrievedElementIndex,
            1,
            extractedValue
          );
        } else if (retrievedElementIndex === 0) {
          if (allRetrievedReferencesConverted.length > 1) {
            retrievedPreviousFormValuesForReferences.shift();
            retrievedPreviousFormValuesForReferences.unshift(extractedValue);
          } else {
            retrievedPreviousFormValuesForReferences = [`${extractedValue}`];
          }
        }

        formikConf.setFieldValue(
          `${mediaType}s.${mediaType}Data-${dataKeyRefId}.${mediaKeyRef}s`,
          retrievedPreviousFormValuesForReferences
        );

        setFormPreviewData((previousFormPreviewData: any) => {
          return {
            ...previousFormPreviewData,
            current: {
              ...previousFormPreviewData[`current`],
              data: {
                ...previousFormPreviewData[`current`][`data`],
                [`${mediaKeyRef}s`]: retrievedPreviousFormValuesForReferences,
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

      newFormFileInputElement.onchange = (event) => {
        console.log({ event });
        const eventTyped = (event as unknown) as React.ChangeEvent<HTMLInputElement>;
        let fileToURL = eventTyped[`target`][`files`]
          ? URL.createObjectURL(eventTyped[`target`][`files`][0])
          : undefined;
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
                `${mediaType}Data-${dataKeyRefId}`
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
          let dataReset = {};
          if (mediaType === `video`) {
            dataReset = { name: ``, url: ``, type: `` };
          } else if (mediaType === `galleryPhoto`) {
            dataReset = { title: ``, photo: `reset`, references: [``] };
          } else if (mediaType === `passage`) {
            dataReset = {
              title: ``,
              whatIsIt: ``,
              content: ``,
              references: [``],
            };
          }
          return {
            ...previousFormPreviewData,
            [`current`]: {
              [`type`]: mediaType,
              [`data`]: dataReset,
            },
          };
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

        let allRetrievedInputReferences = (eventTyped.target.parentNode
          ?.parentNode?.childNodes as unknown) as Array<HTMLDivElement>;

        let allRetrievedInputReferencesConverted = Array.prototype.slice.call(
          allRetrievedInputReferences
        );

        let retrievedElementIndex = allRetrievedInputReferencesConverted.findIndex(
          (element) =>
            element.id ===
            `${mediaType}-${mediaKeyRef}-${dataKeyRefId}-subId-${generatedSubId}`
        );

        let updatedReferencesValues: Array<string> = [];

        allRetrievedInputReferences.forEach((referenceElement) => {
          let typedReferenceElement = (referenceElement
            .childNodes[2] as unknown) as HTMLInputElement;
          updatedReferencesValues.push(typedReferenceElement.value);
        });

        if (updatedReferencesValues.length >= 1) {
          if (
            retrievedElementIndex > 0 &&
            retrievedElementIndex < updatedReferencesValues.length - 1
          ) {
            updatedReferencesValues.splice(retrievedElementIndex, 1);
          } else if (
            retrievedElementIndex === updatedReferencesValues.length - 1 &&
            retrievedElementIndex !== 0
          ) {
            updatedReferencesValues.pop();
          } else if (retrievedElementIndex === 0) {
            updatedReferencesValues.shift();
          }
        }

        formikConf.setFieldValue(
          `${mediaType}s.${mediaType}Data-${dataKeyRefId}.${mediaKeyRef}s`,
          updatedReferencesValues
        );

        setValidSchema((prevYupSchema: any) => {
          let updatedSchema = createYupSchema({
            schema: prevYupSchema,
            config: {
              id: {
                mediaType: `${mediaType}s`,
                dataRefId: `${mediaType}Data-${dataKeyRefId}`,
                inputKeyRef: `references`,
              },
              validationType: `array`,
              validations: [
                {
                  type: `of`,
                  params: yup.string().required(),
                },
                {
                  type: `length`,
                  params: allRetrievedInputReferences.length - 1,
                },
              ],
            },
          });
          return updatedSchema;
        });

        console.log({ allRetrievedInputReferences, updatedReferencesValues });

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
    elementToAppendTo?: HTMLElement,
    inputId?: string
  ) => {
    let newFormInputs;

    let newFormInputElementsHold = [];

    let newFormInputElementsForReferencesHold = [];

    let newInputsReferenceId = v4();

    let dataConfigObject: object = {};

    for (let i = 0; i < inputElementsKeyRefs.length; i++) {
      /*
      let mediaKeyRefFirstLetterCapitalized =
        inputElementsKeyRefs[i].key[0].toUpperCase() +
        inputElementsKeyRefs[i].key.slice(1);
        */

      if (inputElementsKeyRefs[i].typeOfInput === `textInputWithSubIndex`) {
        newFormInputElementsForReferencesHold.push(
          newFormElement(
            `${inputElementsKeyRefs[i].typeOfInput}`,
            `${whichMediaType}`,
            `${inputElementsKeyRefs[i].key}`,
            inputId ? inputId : newInputsReferenceId,
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
            inputId ? inputId : newInputsReferenceId,
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
            inputId ? inputId : newInputsReferenceId,
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
            inputId ? inputId : newInputsReferenceId,
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
                  inputId ? inputId : newInputsReferenceId
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

    if (newFormInputElementsForReferencesHold.length > 0) {
      dataConfigObject = { ...dataConfigObject, [`references`]: undefined };

      let initialReferencesFragment = document.createElement("div");
      initialReferencesFragment.className = `elementAdjustmentsForReferences`;

      let addReferenceInputButton = document.createElement("div");
      addReferenceInputButton.className = `${whichMediaType}-add-reference-button`;
      addReferenceInputButton.innerHTML = `+`;
      addReferenceInputButton.onclick = (event) => {
        let eventTyped = (event as unknown) as React.ChangeEvent<HTMLInputElement>;

        const retrievingNewSubIndex = () => {
          let clarifiedNewSubIndex =
            eventTyped.target.parentNode?.childNodes[3].childNodes.length;
          return clarifiedNewSubIndex;
        };
        const retrievedNewSubIndex = retrievingNewSubIndex();

        let addedReferenceInputElement = newFormElement(
          `textInputWithSubIndex`,
          `${whichMediaType}`,
          `reference`,
          inputId ? inputId : newInputsReferenceId,
          `${whichMediaType}-reference`
        );

        setValidSchema((prevYupSchema: any) => {
          let updatedSchema = createYupSchema({
            schema: prevYupSchema,
            config: {
              id: {
                mediaType: `${whichMediaType}s`,
                dataRefId: `${whichMediaType}Data-${
                  inputId ? inputId : newInputsReferenceId
                }`,
                inputKeyRef: `references`,
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
          return updatedSchema;
        });

        eventTyped.target.parentNode?.childNodes[3].appendChild(
          addedReferenceInputElement
        );

        addedReferenceInputElement.scrollIntoView(false);
      };

      let initialReferencesInputs = newFormElement(
        `inputsContainer`,
        `${whichMediaType}`,
        `references`,
        inputId ? inputId : newInputsReferenceId,
        `${whichMediaType}-references`,
        newFormInputElementsForReferencesHold
      );

      initialReferencesInputs.firstChild?.after(addReferenceInputButton);

      newFormInputElementsHold.push(initialReferencesInputs);

      setValidSchema((prevYupSchema: any) => {
        let updatedSchema = createYupSchema({
          schema: prevYupSchema,
          config: {
            id: {
              mediaType: `${whichMediaType}s`,
              dataRefId: `${whichMediaType}Data-${
                inputId ? inputId : newInputsReferenceId
              }`,
              inputKeyRef: `references`,
            },
            validationType: `array`,
            validations: [
              {
                type: `of`,
                params: yup.string().required(),
              },
              {
                type: `length`,
                params: newFormInputElementsForReferencesHold.length,
              },
            ],
          },
        });
        return updatedSchema;
      });
    }

    newFormInputs = newFormElement(
      `inputsContainer`,
      `${whichMediaType}`,
      `data`,
      inputId ? inputId : newInputsReferenceId,
      `${whichMediaType}`,
      newFormInputElementsHold,
      dataConfigObject
    );

    if (elementToAppendTo) {
      elementToAppendTo.appendChild(newFormInputs);
      newFormInputs.scrollIntoView(false);
    }
    return {
      id: `${whichMediaType}Data-${inputId ? inputId : newInputsReferenceId}`,
      inputs: newFormInputs,
    };
  };

  // Declare function for switching between mini forms
  const switchMediaMiniForm = (switchTo: string) => {
    for (let x in storedRefs) {
      let checkedIfMiniForm = RegExp(`MiniForm`).test(x);
      if (checkedIfMiniForm) {
        let checkedIfFormMatches = RegExp(switchTo).test(x);
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
    selectedChildId: string
  ) => {
    let whichMedia = ``;
    if (selectedChildId.includes(`video`)) {
      whichMedia = `video`;
    } else if (selectedChildId.includes(`muralPhoto`)) {
      whichMedia = `muralPhoto`;
    } else if (selectedChildId.includes(`galleryPhoto`)) {
      whichMedia = `galleryPhoto`;
    } else if (selectedChildId.includes(`passage`)) {
      whichMedia = `passage`;
    }
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
        childNodeLabelElementTyped.className = `${whichMedia}-label`;
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
      if (dataForForm[`forId`][`includes`](`passage`)) {
        formikConf.setFieldValue(
          `passages.${dataForForm[`forId`]}.${dataForForm[`forInput`]}`,
          dataForForm[`inputValue`]
        );
        setFormPreviewData((previousFormPreviewData) => {
          return {
            ...previousFormPreviewData,
            stored: {
              ...previousFormPreviewData[`stored`],
              [`passages`]: {
                ...previousFormPreviewData[`stored`][`passages`],
                [`${dataForForm[`forId`]}`]: {
                  ...previousFormPreviewData[`stored`][`passages`][
                    `${dataForForm[`forId`]}`
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
        formikConf.setFieldValue(`test.title`, ``);
        formikConf.setFieldValue(`videos`, dataForForm[`inputValue`]);
        formikConf.setFieldValue(`muralPhotos`, dataForForm[`inputValue`]);
        formikConf.setFieldValue(`galleryPhotos`, dataForForm[`inputValue`]);
        formikConf.setFieldValue(`passages`, dataForForm[`inputValue`]);
        setValidSchema(() => {
          const schemaReset = yup.object().shape({
            test: yup.object().shape({
              title: yup.string().required(),
            }),
          });
          return schemaReset;
        });
      } else if (dataForForm[`forId`][`includes`](`fetchedProjectData`)) {
        console.log({ dataForForm });

        for (let v in dataForForm[`inputValue`][`videos`]) {
          let dataExtracted = dataForForm[`inputValue`][`videos`][v];
          const { id } = addNewInputs(
            `video`,
            [
              {
                key: `name`,
                typeOfInput: `textInput`,
                initialValue: dataExtracted[`name`],
              },
              {
                key: `url`,
                typeOfInput: `textInput`,
                initialValue: dataExtracted[`url`],
              },
              {
                key: `type`,
                typeOfInput: `listInput`,
                childrenElements: [`youtube`, `not listed`],
                initialValue: dataExtracted[`type`],
              },
            ],
            storedRefs[`videosInputViewRef`].current,
            dataExtracted[`id`]
          );
        }
        for (let gP in dataForForm[`inputValue`][`galleryPhotos`]) {
          let dataExtracted = dataForForm[`inputValue`][`galleryPhotos`][gP];
          const { id } = addNewInputs(
            `galleryPhoto`,
            [
              {
                key: `photo`,
                typeOfInput: `fileInput`,
                initialValue: dataExtracted[`photo`],
              },
              {
                key: `title`,
                typeOfInput: `textInput`,
                initialValue: dataExtracted[`title`],
              },
              {
                key: `reference`,
                typeOfInput: `textInputWithSubIndex`,
                initialValue: dataExtracted[`references`][0],
              },
            ],
            storedRefs[`galleryPhotosInputViewRef`].current,
            dataExtracted[`id`]
          );
        }
        for (let p in dataForForm[`inputValue`][`passages`]) {
          let dataExtracted = dataForForm[`inputValue`][`passages`][p];
          const { id } = addNewInputs(
            `passage`,
            [
              {
                key: `title`,
                typeOfInput: `textInput`,
                initialValue: dataExtracted[`title`],
              },
              {
                key: `whatIsIt`,
                typeOfInput: `textInput`,
                initialValue: dataExtracted[`whatIsIt`],
              },
              {
                key: `content`,
                typeOfInput: ``,
                initialValue: dataExtracted[`content`],
              },
              {
                key: `reference`,
                typeOfInput: `textInputWithSubIndex`,
                initialValue: dataExtracted[`references`][0],
              },
            ],
            storedRefs[`passagesInputViewRef`].current,
            dataExtracted[`id`]
          );
        }

        formikConf.setFieldValue(
          `test.title`,
          dataForForm[`inputValue`][`test`][`title`]
        );
        formikConf.setFieldValue(`videos`, dataForForm[`inputValue`][`videos`]);
        formikConf.setFieldValue(
          `galleryPhotos`,
          dataForForm[`inputValue`][`galleryPhotos`]
        );
        formikConf.setFieldValue(
          `passages`,
          dataForForm[`inputValue`][`passages`]
        );

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
          <div className={styles.formDataInputsHeader}>
            {extraHeaderOptions}
            <button
              type={`submit`}
              className={styles.innerFormSubmitButton}
            >{`Submit`}</button>
          </div>
          <input
            name={`test.title`}
            placeholder={`TITLE`}
            className={styles.anIdeaTitle}
            type={"text"}
            value={formikConf.values.test.title}
            onChange={(event) => {
              formikConf.handleChange(event);
              formikConf.handleBlur(event);
            }}
            onBlur={formikConf.handleBlur}
            autoComplete={"off"}
          />
          <div className={styles.mediaSelectionNavDisplay}>
            <div
              className={styles.mediaSelectionNavButton}
              onClick={(event) => {
                switchMediaMiniForm(`videos`);
                setFormPreviewData((previousMediaPreviewData: any) => {
                  const fetchingMediaPreviewData = () => {
                    if (
                      mediaDataIds[`current`][`video`] !== `` &&
                      mediaDataIds[`current`][`video`] !== -1
                    ) {
                      return {
                        ...previousMediaPreviewData,
                        current: {
                          type: `video`,
                          data:
                            formikConf[`values`][`videos`][
                              mediaDataIds[`current`][`video`]
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
            >{`Vids`}</div>
            <div
              className={styles.mediaSelectionNavButtonDisabled}
              onClick={(event) => {
                /*
                switchMediaMiniForm(`muralPhotos`);
                setFormPreviewData((previousMediaPreviewData: any) => {
                  const fetchingMediaPreviewData = () => {
                    if (
                      mediaDataIds[`current`][`muralPhoto`] !== `` &&
                      mediaDataIds[`current`][`muralPhoto`] !== -1
                    ) {
                      return {
                        ...previousMediaPreviewData,
                        current: {
                          type: `muralPhoto`,
                          data:
                            formikConf[`values`][`muralPhotos`][
                              mediaDataIds[`current`][`muralPhoto`]
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
                */
              }}
            >{`Murals`}</div>
            <div
              className={styles.mediaSelectionNavButton}
              onClick={(event) => {
                switchMediaMiniForm(`galleryPhotos`);
                setFormPreviewData((previousMediaPreviewData: any) => {
                  const fetchingMediaPreviewData = () => {
                    if (
                      mediaDataIds[`current`][`galleryPhoto`] !== `` &&
                      mediaDataIds[`current`][`galleryPhoto`] !== -1
                    ) {
                      return {
                        ...previousMediaPreviewData,
                        current: {
                          type: `galleryPhoto`,
                          data:
                            formikConf[`values`][`galleryPhotos`][
                              mediaDataIds[`current`][`galleryPhoto`]
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
            >{`Gallery`}</div>
            <div
              className={styles.mediaSelectionNavButton}
              onClick={(event) => {
                switchMediaMiniForm(`passages`);
                setFormPreviewData((previousMediaPreviewData: any) => {
                  const fetchingMediaPreviewData = () => {
                    if (
                      mediaDataIds[`current`][`passage`] !== `` &&
                      mediaDataIds[`current`][`passage`] !== -1
                    ) {
                      return {
                        ...previousMediaPreviewData,
                        current: {
                          type: `passage`,
                          data:
                            formikConf[`values`][`passages`][
                              mediaDataIds[`current`][`passage`]
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
            >{`Passages`}</div>
          </div>
          <div
            ref={storedRefs[`videosMiniForm`]}
            className={styles.innerFormSectionContainer}
          >
            <button
              type={`button`}
              className={styles.innerFormAddInputButton}
              onClick={(event) => {
                const { id } = addNewInputs(
                  `video`,
                  [
                    { key: `name`, typeOfInput: `textInput` },
                    { key: `url`, typeOfInput: `textInput` },
                    {
                      key: `type`,
                      typeOfInput: `listInput`,
                      childrenElements: [`youtube`, `not listed`],
                    },
                  ],
                  storedRefs[`videosInputViewRef`].current
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
                  id
                );
                setMediaDataIds((previousMediaDataIds: any) => {
                  return {
                    ...previousMediaDataIds,
                    [`current`]: {
                      ...previousMediaDataIds[`current`],
                      [`video`]: id,
                    },
                  };
                });
                setFormPreviewData((previousFormPreviewData) => {
                  return {
                    ...previousFormPreviewData,
                    current: {
                      type: `video`,
                      data: formikConf[`values`][`videos`][id],
                    },
                  };
                });
              }}
            >{`Add Video`}</button>
            <div
              ref={storedRefs[`videosInputViewRef`]}
              className={styles.innerFormSectionInputs}
            ></div>
          </div>
          <div
            ref={storedRefs[`muralPhotosMiniForm`]}
            className={styles.innerFormSectionContainer}
          >
            <button
              type={`button`}
              className={styles.innerFormAddInputButton}
              onClick={(event) => {
                const { id } = addNewInputs(
                  `muralPhoto`,
                  [
                    { key: `photo`, typeOfInput: `fileInput` },
                    { key: `whichSet`, typeOfInput: `textInput` },
                    { key: `name`, typeOfInput: `textInput` },
                    {
                      key: `orientation`,
                      typeOfInput: `listInput`,
                      childrenElements: [
                        `bottomLeft`,
                        `topLeft`,
                        `middle`,
                        `bottomRight`,
                        `topRight`,
                      ],
                    },
                    {
                      key: `reference`,
                      typeOfInput: `textInputWithSubIndex`,
                    },
                  ],
                  storedRefs[`muralPhotosInputViewRef`].current
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
                  id
                );
                setMediaDataIds((previousMediaDataIds: any) => {
                  return {
                    ...previousMediaDataIds,
                    [`current`]: {
                      ...previousMediaDataIds[`current`],
                      [`muralPhoto`]: id,
                    },
                  };
                });
                setFormPreviewData((previousFormPreviewData) => {
                  return {
                    ...previousFormPreviewData,
                    current: {
                      type: `muralPhoto`,
                      data: formikConf[`values`][`muralPhotos`][id],
                    },
                  };
                });
              }}
            >{`Add Mural Photo`}</button>
            <div
              ref={storedRefs[`muralPhotosInputViewRef`]}
              className={styles.innerFormSectionInputs}
            ></div>
          </div>
          <div
            ref={storedRefs[`galleryPhotosMiniForm`]}
            className={styles.innerFormSectionContainer}
          >
            <button
              type={`button`}
              className={styles.innerFormAddInputButton}
              onClick={(event) => {
                const { id } = addNewInputs(
                  `galleryPhoto`,
                  [
                    { key: `photo`, typeOfInput: `fileInput` },
                    { key: `title`, typeOfInput: `textInput` },
                    {
                      key: `reference`,
                      typeOfInput: `textInputWithSubIndex`,
                    },
                  ],
                  storedRefs[`galleryPhotosInputViewRef`].current
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
                  id
                );
                setMediaDataIds((previousMediaDataIds: any) => {
                  return {
                    ...previousMediaDataIds,
                    [`current`]: {
                      ...previousMediaDataIds[`current`],
                      [`galleryPhoto`]: id,
                    },
                  };
                });
                setFormPreviewData((previousFormPreviewData) => {
                  return {
                    ...previousFormPreviewData,
                    current: {
                      type: `galleryPhoto`,
                      data: formikConf[`values`][`galleryPhotos`][id],
                    },
                  };
                });
              }}
            >{`Add Gallery Photo`}</button>
            <div
              ref={storedRefs[`galleryPhotosInputViewRef`]}
              className={styles.innerFormSectionInputs}
            ></div>
          </div>
          <div
            ref={storedRefs[`passagesMiniForm`]}
            className={styles.innerFormSectionContainer}
          >
            <button
              type={`button`}
              className={styles.innerFormAddInputButton}
              onClick={(event) => {
                const { id } = addNewInputs(
                  `passage`,
                  [
                    { key: `title`, typeOfInput: `textInput` },
                    { key: `whatIsIt`, typeOfInput: `textInput` },
                    { key: `content`, typeOfInput: `` },
                    {
                      key: `reference`,
                      typeOfInput: `textInputWithSubIndex`,
                    },
                  ],
                  storedRefs[`passagesInputViewRef`].current
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
                  id
                );
                setMediaDataIds((previousMediaDataIds: any) => {
                  return {
                    ...previousMediaDataIds,
                    [`current`]: {
                      ...previousMediaDataIds[`current`],
                      [`passage`]: id,
                    },
                  };
                });
                setFormPreviewData((previousFormPreviewData) => {
                  return {
                    ...previousFormPreviewData,
                    current: {
                      type: `passage`,
                      data: formikConf[`values`][`passages`][id],
                    },
                  };
                });
              }}
            >{`Add Passage`}</button>
            <div
              ref={storedRefs[`passagesInputViewRef`]}
              className={styles.innerFormSectionInputs}
            ></div>
          </div>
        </div>
      </form>
    </div>
  );
};

const API: React.FC = () => {
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
        height: `${screenHeight}px`,
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
        width:
          formPreviewData[`current`][`type`] === `allNewData` ||
          formPreviewData[`current`][`type`] === `apiFrontPage` ||
          formPreviewData[`current`][`type`] === `viewExistingProject` ||
          formPreviewData[`current`][`type`] === `reCheck`
            ? 0
            : screenWidth / 3,
        maxHeight: screenHeight,
      },
      outterMediaPreviewDisplaySupport: {
        ...styles.outterMediaPreviewDisplaySupport,
        width:
          formPreviewData[`current`][`type`] === `allNewData` ||
          formPreviewData[`current`][`type`] === `apiFrontPage` ||
          formPreviewData[`current`][`type`] === `viewExistingProject` ||
          formPreviewData[`current`][`type`] === `reCheck`
            ? `100%`
            : `${(screenWidth / 3) * 2}px`,
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
      formEmbedder: `formEmbedder`,
      innerFormMainDisplay: `innerFormMainDisplay`,
      innerFormDisplaySupport: {
        borderWidth: 0,
        width: 0,
        height: "auto",
        maxHeight: Dimensions.get("window").height,
      },
      innerFormSectionContainer: `innerFormSectionContainer`,
      innerFormSectionInputs: `innerFormSectionInputs`,
      innerFormAddInputButton: `innerFormAddInputButton`,
      innerFormSubmitButton: `innerFormSubmitButton`,
      formDataInputsHeader: `formDataInputsHeader`,
      extraHeaderOptionFreshFormBackToApiFrontPageButton: `extraHeaderOptionFreshFormBackToApiFrontPageButton`,
      extraHeaderOptionFetchedProjectDataBackToFullPreviewPageButton: `extraHeaderOptionFetchedProjectDataBackToFullPreviewPageButton`,
      anIdeaTitle: `anIdeaTitle`,
      mediaSelectionNavDisplay: `mediaSelectionNavDisplay`,
      mediaSelectionNavButton: `mediaSelectionNavButton`,
      mediaSelectionNavButtonDisabled: `mediaSelectionNavButtonDisabled`,
      outterMediaPreviewDisplay: `outterMediaPreviewDisplay`,
      outterMediaPreviewDisplaySupport: {
        width: `100%`,
        height: `auto`,
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
      muralPhoto: string | number;
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
        muralPhoto: ``,
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
        <div
          className={styles.browseIdeasForEditButton}
          onClick={async () => {
            let forStorage = { gallery: {}, passages: {} };
            let allVideosData = {};
            let allGalleryData = {};
            let allJournalData = {};
            let consolidatedData = {};
            let dataBaseProjectIds: Array<string> = [];
            let configuredId = { id: ``, index: -1 };

            const handleRetrievalOfProjectData = async () => {
              const allCurrentDatabaseProjectsIds = await retrieveAllProjectsIds();
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
            configuredId = { [`id`]: retrievedFullData[`_id`], [`index`]: 0 };
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
            console.log({ fetchedProjectData, consolidatedData, configuredId });
          }}
        >{`BROWSE IDEAS TO EDIT`}</div>
        <div
          className={styles.toMainProjectsPageButton}
          onClick={() => {
            window.location.href = `${localUrl}project`;
          }}
        >{`MAIN PROJECTS PAGE`}</div>
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
    muralPhotosInputViewRef: React.useRef<any>(),
    muralPhotosMiniForm: React.useRef(),
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
          borderWidth: 2,
          width: screenWidth / 3,
          maxHeight: screenHeight,
        },
        outterMediaPreviewDisplaySupport: {
          ...previousStyles.outterMediaPreviewDisplaySupport,
          width: `${(screenWidth / 3) * 2}px`,
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
            const jsonParsed = res.json();
            return jsonParsed;
          })
          .then((data) => {
            return data._id;
          });

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
        let retrievedPhotoPreviewData =
          galleryFormPreviewData[`${retrievedGalleryFormInputs[u][`id`]}`];
        console.log({ retrievedPhotoPreviewData, retrievedStoreDataForPhoto });
        if (IdeaId) {
          if (
            retrievedPhotoPreviewData[`photo`][`includes`](
              `blob:http://localhost:3000`
            ) ||
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
                `blob:http://localhost:3000`
              )
                ? undefined
                : conditionalFilenameConfig,
            };
            galleryFormData[`append`](`photos`, retrievedPhotoFileData);
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
        let verifiedPhotoForGallery = Object.values(
          galleryFormPreviewData
        ).some(
          (data: any) => data.id === retrievedStoreDataForGallery[c][`id`]
        );

        if (!verifiedPhotoForGallery) {
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
        return res.json();
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
          width: 0,
        },
        outterMediaPreviewDisplaySupport: {
          ...styles[`outterMediaPreviewDisplaySupport`],
          width: `100%`,
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
          <div
            className={styles.browseIdeasForEditButton}
            onClick={async () => {
              removeAllChildNodes(storedRefs[`videosInputViewRef`][`current`]);
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
                const allCurrentDatabaseProjectsIds = await retrieveAllProjectsIds();
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
          <div
            className={styles.toMainProjectsPageButton}
            onClick={() => {
              window.location.href = `${localUrl}project`;
            }}
          >{`MAIN PROJECTS PAGE`}</div>
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
    console.log({ formPreviewData, mediaDataIds });
    if (formPreviewData[`current`][`type`] === `video`) {
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
                forId: mediaDataIds[`current`][`passage`],
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
                    destroyProjectButtonRef.current.innerHTML = `DESTROY PROJECT`;
                    destroyProjectButtonRef.current.style.color = ``;
                    destroyProjectButtonRef.current.style.borderColor = ``;
                    destroyProjectButtonRef.current.style.backgroundColor = ``;
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
                  setMediaDataIds((previousMediaDataIds) => {
                    let copyOfIds = { ...previousMediaDataIds };
                    let copyOfDatabaseIds = [
                      ...copyOfIds[`dataBaseProjectIds`],
                    ];
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
                    retrievePreviousFetchedProject(true, copyOfIds);
                    return copyOfIds;
                  });
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
                      borderWidth: 2,
                      width: screenWidth / 3,
                    },
                    [`outterMediaPreviewDisplaySupport`]: {
                      ...previousStyles[`outterMediaPreviewDisplaySupport`],
                      width: `${(screenWidth / 3) * 2}px`,
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
            >{`UPLOAD NEW IDEA TO DATABASE`}</div>
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
            borderWidth: 0,
            width: 0,
            height: `0%`,
          },
          outterMediaPreviewDisplaySupport: {
            ...styles[`outterMediaPreviewDisplaySupport`],
            width: `100%`,
            height: `100%`,
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
            borderWidth: 2,
            width: screenWidth / 3,
          },
          outterMediaPreviewDisplaySupport: {
            ...previousStyles[`outterMediaPreviewDisplaySupport`],
            width: `${(screenWidth / 3) * 2}px`,
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
  }, [formPreviewData]);

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
                forId: mediaDataIds[`current`][`passage`],
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
      <FormConfiguration
        styles={styles}
        customInitialFormValues={{
          initialFormValues: initialFormValues,
          setInitialFormValues: setInitialFormValues,
        }}
        ids={{ mediaDataIds, setMediaDataIds }}
        formPreviewDataOpts={{ formPreviewData, setFormPreviewData }}
        customFormSchema={{
          validSchema: validSchema,
          setValidSchema: setValidSchema,
        }}
        storedRefs={storedRefs}
        dataForForm={dataForForm}
      />
      <div
        className={styles.outterMediaPreviewDisplay}
        style={styles.outterMediaPreviewDisplaySupport}
      >
        {formPreviewDisplay}
      </div>
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
