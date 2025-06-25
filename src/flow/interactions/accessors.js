/*

Plant 3D Explorer: A browser application for 3D scanned plants.

Copyright (C) 2019-2020 Sony Computer Science Laboratories
              & Centre national de la recherche scientifique (CNRS)

Authors:
Nicolas Forestier, Ludovic Riffault, Léo Gourven, Benoit Lucet (DataVeyes)
Timothée Wintz, Peter Hanappe (Sony CSL)
Fabrice Besnard (CNRS)

This program is free software: you can redistribute it and/or
modify it under the terms of the GNU Affero General Public
License as published by the Free Software Foundation, either
version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public
License along with this program.  If not, see
<https://www.gnu.org/licenses/>.

*/
import useAccessor from 'rd/tools/hooks/accessor'

/**
 * A variable that utilizes the `useAccessor` function to manage interactions reset functionality.
 * It facilitates dispatching an action object with type 'RESET_INTERACTIONS' and an associated value.
 *
 * The structure of the dispatched action is:
 * - type: 'RESET_INTERACTIONS'
 * - value: A parameter passed for resetting interactions.
 *
 * This variable is used to handle resetting or updating interactions state in a defined system.
 */
export const useResetInteraction = useAccessor(
  [],
  [
    (value) => ({
      type: 'RESET_INTERACTIONS',
      value
    })
  ]
)

/**
 * A variable that manages the state of a hovered camera interaction.
 * Utilizes the `useAccessor` function to handle state access and dispatching.
 *
 * The first parameter is an array containing a function to access the current state of the hovered camera from the `state` object.
 * Specifically, this retrieves the `hoveredCamera` property from the `interactions` portion of the state.
 *
 * The second parameter is an array containing a function to generate an action object for dispatching.
 * The generated action object includes a `type` of "HOVER_CAMERA" and a `value` payload.
 *
 * Purpose:
 * Facilitates the retrieval and update of the `hoveredCamera` state, likely tied to user interaction or event handling.
 */
export const useHoveredCamera = useAccessor(
  [
    (state) => {
      return state.interactions.hoveredCamera
    }
  ],
  [
    (value) => ({
      type: 'HOVER_CAMERA',
      value
    })
  ]
)
/**
 * A variable that provides a state accessor for managing the currently selected camera in the application.
 *
 * The state accessor is defined with two primary functions:
 * - A getter function to retrieve the value of the selected camera from the application state.
 * - A setter function to dispatch an action for updating the selected camera in the state.
 *
 * This variable leverages `useAccessor` to connect the interactions with the application's state management system.
 * It allows both reading the current camera selection and updating it through a dispatched action (`SELECT_CAMERA`).
 */
export const useSelectedcamera = useAccessor(
  [
    (state) => {
      return state.interactions.selectedCamera
    }
  ],
  [
    (value) => ({
      type: 'SELECT_CAMERA',
      value
    })
  ]
)

/**
 * `useHoveredAngle` is a state accessor that provides a mechanism to read and dispatch changes
 * related to the `hoveredAngle` property in the application's state. It facilitates interaction
 * management by accessing the current hovered angle value and dispatching actions to update it.
 *
 * - Reads the `hoveredAngle` property from the `interactions` section of the state.
 * - Dispatches an action with type `'HOVER_ANGLE'` and the provided value to update the state.
 *
 * Useful in contexts where managing or monitoring the current angle hovered by the user is required.
 */
export const useHoveredAngle = useAccessor(
  [
    (state) => {
      return state.interactions.hoveredAngle
    }
  ],
  [
    (value) => ({
      type: 'HOVER_ANGLE',
      value
    })
  ]
)
/**
 * `useSelectedAngle` is a state accessor and mutator function that manages the selection of an angle
 * within the application state. It utilizes a getter function to retrieve the currently selected angle
 * from the state and a setter function to dispatch an action to update the selected angle.
 *
 * This variable is implemented using the `useAccessor` utility, which combines state selectors and
 * action dispatchers, making it easier to manage state in a functional manner.
 *
 * Getter:
 * - Retrieves the `selectedAngle` value from the `interactions` section of the application state.
 *
 * Setter:
 * - Dispatches an action of type `SELECT_ANGLE` with the provided `value` to update the selected angle
 *   in the state.
 *
 * Intended for use where interaction with or modification of the `selectedAngle` is required.
 */
export const useSelectedAngle = useAccessor(
  [
    (state) => {
      return state.interactions.selectedAngle
    }
  ],
  [
    (value) => ({
      type: 'SELECT_ANGLE',
      value
    })
  ]
)

/**
 * The `useColor` variable is a state accessor and modifier built using `useAccessor`.
 *
 * It provides functionality to access and modify the colors defined in the application's state interactions.
 *
 * Access:
 * The first argument to `useAccessor` contains a function that retrieves the colors from the `state.interactions.colors` property.
 *
 * Modification:
 * The second argument to `useAccessor` contains a function that returns an action object. The action object includes a `type` property set to `'SET_COLORS'` and the updated `value` to modify the state's colors.
 *
 * This variable is typically used to handle state-driven color interactions within the application.
 */
export const useColor = useAccessor(
  [
    (state) => {
      return state.interactions.colors
    }
  ],
  [
    (value) => ({
      type: 'SET_COLORS',
      value
    })
  ]
)

/**
 * A variable that utilizes an accessor to manage color configurations
 * with a default behavior of restoring color settings to their original state.
 *
 * The accessor operates with an empty array as initial input and a single handler
 * function that generates an action object to restore default colors.
 *
 * The returned action object includes:
 * - A `type` property set to 'RESTORE_DEFAULT_COLOR'.
 * - A `value` property reflecting the input value.
 */
export const useDefaultColors = useAccessor(
  [],
  [
    (value) => ({
      type: 'RESTORE_DEFAULT_COLOR',
      value
    })
  ]
)

/**
 * A variable that utilizes the `useAccessor` function to provide
 * reactive state management for a snapshot. The `useSnapshot` variable
 * is used to access and update the `snapshot` property in the interactions
 * portion of the state.
 *
 * The state accessor retrieves the current `snapshot` value from the
 * application's state. The state mutator dispatches an action of type
 * `SET_SNAPSHOT`, enabling the update of the `snapshot` value with a
 * new provided value.
 */
export const useSnapshot = useAccessor(
  [
    (state) => {
      return state.interactions.snapshot
    }
  ],
  [
    (value) => ({
      type: 'SET_SNAPSHOT',
      value
    })
  ]
)

/**
 * A state accessor for managing the reset 2D view functionality in an application.
 *
 * This variable uses the `useAccessor` hook to define getters and setters for the state associated with the `reset2dViewFn`.
 * The getter retrieves the current reset 2D view function from the application's state.
 * The setter allows updating the state with a new value for the reset 2D view function, dispatching an action of type `SET_RESET_2D_VIEW`.
 */
export const useReset2dView = useAccessor(
  [
    (state) => {
      return state.interactions.reset2dViewFn
    }
  ],
  [
    (value) => ({
      type: 'SET_RESET_2D_VIEW',
      value
    })
  ]
)

/**
 * A custom accessor hook for resetting the 3D view in the application.
 *
 * This variable utilizes a functional accessor pattern to manage the
 * state of the 3D view resetting functionality. It interacts with the
 * state management system to retrieve and dispatch changes to the
 * reset3dViewFn property in the application's interactions state.
 *
 * The first parameter specifies how to access the current reset function
 * from the state, while the second parameter defines the action that
 * will update the state with a new reset function.
 *
 * @type {function} useReset3dView
 * Returns the current reset3dViewFn state and a dispatcher to set new values.
 */
export const useReset3dView = useAccessor(
  [
    (state) => {
      return state.interactions.reset3dViewFn
    }
  ],
  [
    (value) => ({
      type: 'SET_RESET_3D_VIEW',
      value
    })
  ]
)

/**
 * Hook that provides read and write access to the `organInfo` state within the interactions portion of the application's state.
 *
 * This variable uses the `useAccessor` utility to define:
 * - A reader function to retrieve the current `organInfo` state.
 * - A writer function to dispatch an action for updating the `organInfo` state with the specified value.
 *
 * The state is expected to be managed in a Redux-style architecture where actions with specific types, such as 'SET_ORGAN_INFO',
 * are dispatched to update the state.
 *
 * Returns an accessor object that enables interaction with the `organInfo` state.
 */
export const useOrganInfo = useAccessor(
  [
    (state) => {
      return state.interactions.organInfo
    }
  ],
  [
    (value) => ({
      type: 'SET_ORGAN_INFO',
      value
    })
  ]
)

/**
 * A variable that utilizes the `useAccessor` hook/function to manage and interact with selected points in the application state.
 *
 * The getter function retrieves the `selectedPoints` from the `interactions` slice of the application state.
 *
 * The setter function dispatches an action of type `SET_SELECTED_POINTS`, allowing updates to the `selectedPoints` value in the state.
 */
export const useSelectedPoints = useAccessor(
  [
    (state) => {
      return state.interactions.selectedPoints
    }
  ],
  [
    (value) => ({
      type: 'SET_SELECTED_POINTS',
      value
    })
  ]
)

/**
 * `useClickedPoint` is a state management accessor function that is used to get
 * and set the currently clicked point in the application's interaction state.
 *
 * The accessor supports:
 * - Reading the `clickedPoint` value from the state, allowing components to react
 *   to a change in the clicked point through re-rendering.
 * - Dispatching an action to update the `clickedPoint` value in the state.
 *
 * Value source:
 * - Retrieves the `clickedPoint` from the `interactions` section of the state.
 *
 * Dispatched action:
 * - Action type: `'SET_CLICKED_POINT'`
 * - Payload: `value`
 */
export const useClickedPoint = useAccessor(
  [
    (state) => {
      return state.interactions.clickedPoint
    }
  ],
  [
    (value) => ({
      type: 'SET_CLICKED_POINT',
      value
    })
  ]
)

/**
 * A state management variable that utilizes `useAccessor` to interact with the application's labels.
 *
 * useLabels provides both a selector and a dispatcher:
 * - Selector: Accesses the current state of `interactions.labels` from the application state.
 * - Dispatcher: Dispatches an action to update the labels in the state. The action type is `SET_LABELS`.
 *
 * This utility enables controlled interaction with the `interactions.labels` property, by both retrieving its current value and updating it.
 */
export const useLabels = useAccessor(
  [
    (state) => {
      return state.interactions.labels
    }
  ],
  [
    (value) => ({
      type: 'SET_LABELS',
      value
    })
  ]
)

/**
 * `useSelectedLabel` is a state accessor and mutator function used to manage and interact with the `selectedLabel` property within the application state.
 *
 * It provides the following functionalities:
 * - Accessing the `selectedLabel` property from the state under the `interactions` object.
 * - Dispatching an action to update the `selectedLabel` property in the state with a new value.
 *
 * The accessor retrieves the current `selectedLabel` value from the state.
 * The mutator dispatches an action of type `SET_SELECTED_LABEL` with the new value to update the state.
 */
export const useSelectedLabel = useAccessor(
  [
    (state) => {
      return state.interactions.selectedLabel
    }
  ],
  [
    (value) => ({
      type: 'SET_SELECTED_LABEL',
      value
    })
  ]
)

/**
 * The `useSelectionMethod` variable is a hook-like utility that connects a selection method from application state to a React component.
 *
 * It utilizes the `useAccessor` function, which accepts two arrays:
 * - The first array contains a function to retrieve the current selection method from the application state.
 * - The second array contains a function to dispatch an action to update the selection method in the application state.
 *
 * The purpose of `useSelectionMethod` is to provide a mechanism for accessing and modifying the selection method in the Redux state within a React environment.
 */
export const useSelectionMethod = useAccessor(
  [
    (state) => {
      return state.interactions.selectionMethod
    }
  ],
  [
    (value) => ({
      type: 'SET_SELECTION_METHOD',
      value
    })
  ]
)

/**
 * The `useRuler` variable is a state accessor and mutator for interacting with the `ruler` state.
 *
 * This accessor reads the `ruler` property from the `interactions` section of the application state
 * and provides a corresponding mutator function to update its value.
 *
 * The state accessor function retrieves the current value of `ruler`, allowing components to
 * reactively consume the state when it changes.
 *
 * The state mutator function dispatches an action of type `SET_RULER` with the new value
 * to update the `ruler` state in the application's state management system.
 */
export const useRuler = useAccessor(
  [
    (state) => {
      return state.interactions.ruler
    }
  ],
  [
    (value) => ({
      type: 'SET_RULER',
      value
    })
  ]
)

/**
 * A variable that provides access to the axis-aligned bounding box (AABB) interaction state
 * and allows dispatching updates to it.
 *
 * The state accessor retrieves the current state of the axis-aligned bounding box (AABB).
 * The action dispatcher updates the state by dispatching an action with a type of "SET_AABB"
 * and the corresponding value.
 *
 * This is typically used for managing bounding box interactions in a reactive application.
 */
export const useAxisAlignedBoundingBox = useAccessor(
  [
    (state) => {
      return state.interactions.aabb
    }
  ],
  [
    (value) => ({
      type: 'SET_AABB',
      value
    })
  ]
)

/**
 * A state accessor for managing the point cloud zoom interaction in the application.
 *
 * This variable provides both a getter and a setter for the `pointCloudZoom` state,
 * which determines the zoom level or zoom-related settings for point cloud interactions.
 *
 * The getter retrieves the current `pointCloudZoom` state value from the application's state management system.
 * The setter dispatches an action to update the `pointCloudZoom` value, with an action type of `SET_POINT_CLOUD_ZOOM`.
 *
 * It is useful for components or utilities that require reading or modifying the point cloud zoom settings.
 */
export const usePointCloudZoom = useAccessor(
  [
    (state) => {
      return state.interactions.pointCloudZoom
    }
  ],
  [
    (value) => ({
      type: 'SET_POINT_CLOUD_ZOOM',
      value
    })
  ]
)

/**
 * A state management accessor for handling the point cloud size in the application.
 *
 * This variable is configured using `useAccessor` to enable access and modification
 * of the `pointCloudSize` property located within the state object's `interactions`.
 *
 * The first parameter is a getter function that retrieves the current `pointCloudSize`
 * value from the state. The second parameter is a setter function that dispatches an
 * action to update `pointCloudSize` in the state with a provided value.
 *
 * The dispatched action has the type 'SET_POINT_CLOUD_SIZE' and includes the new value
 * for updating the state.
 *
 * The `usePointCloudSize` variable is used to facilitate bidirectional binding
 * between the UI and the `pointCloudSize` state property.
 */
export const usePointCloudSize = useAccessor(
  [
    (state) => {
      return state.interactions.pointCloudSize
    }
  ],
  [
    (value) => ({
      type: 'SET_POINT_CLOUD_SIZE',
      value
    })
  ]
)
