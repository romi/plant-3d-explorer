/*

Plant 3D Explorer: An browser application for 3D scanned
plants.

Copyright (C) 2021-2022 Sony Computer Science Laboratories
              & Centre national de la recherche scientifique (CNRS)

Authors:
Nabil Ait Taleb (Sony CSL), Peter Hanappe (Sony CSL)
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

import React from 'react'
import styled from '@emotion/styled'

import { Global } from '@emotion/core'
import Logo from '../ScanList/assets/ico.logo.160x30.svg'

import { H1, H2 } from 'common/styles/UI/Text/titles'
import { green, grey, darkGreen } from 'common/styles/colors'

import { FormattedMessage } from 'react-intl'

const Container = styled.div({
  margin: '15px'
})

const WorldContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  width: '100%'
})

const ColumnContainerCfg = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '25%'
})

const ColumnContainerLuigiStatus = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '75%'
})


const TaskConfigSection = styled.div({
  width: '100%'
})

const RowContainer = styled.div({
  display: 'flex',
  flexDirection: 'column'
})

const TextAreaContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '700px'
})

const TextAreaComponent = styled.textarea({
  height: '680px'
})

const AppHeader = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: 0
})

const AppIntro = styled(H2)({
  display: 'block',
  color: green
})

var currentConfigContent = "";
var currentTask = "";

const queryParams = new URLSearchParams(window.location.search);
const apptype = queryParams.get('apptype');
var scanid = '';
var currentScanid = '';
if (apptype === 'plant3dvision') {
  scanid = queryParams.get('scanid');
  currentScanid = scanid;
}

const PLANT_3D_VISION_PORT = 2000;
const PLANT_IMAGER_PORT = 2500;

const PLANT_3D_VISION_LUIGID_PORT = 8085;
const PLANT_IMAGER_LUIGID_PORT = 8086;

var LUIGID_PORT = 0;
var APP_PORT = 0;
if (apptype === 'plant3dvision') {
  APP_PORT = PLANT_3D_VISION_PORT;
  LUIGID_PORT = PLANT_3D_VISION_LUIGID_PORT;
}
else {
  APP_PORT = PLANT_IMAGER_PORT;
  LUIGID_PORT = PLANT_IMAGER_LUIGID_PORT;
}

export function IFrameComponent(props) {

  const [iframeKey, setIframeKey] = React.useState(0);

  React.useEffect(() => {
    setInterval(() => {
      setIframeKey(iframeKey => iframeKey + 1);
    }, 100000);
  }, 0)

  return <Container>
    <iframe title='Luigi status' src={`http://localhost:${LUIGID_PORT}/`} key={iframeKey} height='855px' width='100%'/>
  </Container>
}

export function TaskConfigParamComponent(props) {

  const [taskList, setTaskList] = React.useState([]);
  const [configList, setConfigList] = React.useState([]);
  const configTextAreaRef = React.useRef();

  React.useEffect(() => {
    async function fetchTaskList() {
      const response = await fetch(`http://localhost:${APP_PORT}/tasklist/${apptype}`);
      const body = await response.json();
      setTaskList(body);
    }
    fetchTaskList();

  }, []);

  React.useEffect(() => {
    async function fetchConfigList() {
      const response = await fetch(`http://localhost:${APP_PORT}/configlist/${apptype}`);
      const body = await response.json();
      setConfigList(body);
    }
    fetchConfigList();

  }, []);

  function handleChangeTask(e) {
    currentTask = e.target.value;
  };

  function handleChangeConfig(e) {
    currentConfigContent = configList[e.target.value];
    configTextAreaRef.current.value = currentConfigContent;
  };

  function handleChangeConfigContent(e) {
    currentConfigContent = e.target.value;
  };

  function handleChangeScanid(e) {
    currentScanid = e.target.value;
  }


  function handleRunClick() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'scanid': currentScanid, 'task': currentTask, 'config': currentConfigContent })
    };

    fetch(`http://localhost:${APP_PORT}/runtask/`, requestOptions);
  };

  function handleCleanClick() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'scanid': currentScanid })
    };

    fetch(`http://localhost:${PLANT_3D_VISION_PORT}/clean/`, requestOptions);
  };

  return <Container>
    <form>
      <fieldset>
        <legend>Task configuration</legend>
        <RowContainer>
          <div>
            <label for="ScanIdInput">Scan:</label>
            <input type="text" id="ScanIdInput" defaultValue={scanid} disabled={apptype === 'plant3dvision'} onChange={(e) => handleChangeScanid(e)} />
          </div>

          <div>
            <label for="TaskSelect">Task:</label>
            <select name="TaskSelect" id="TaskSelect" onChange={(e) => handleChangeTask(e)}>
              {
                taskList.map(task => (
                  <option key={task} value={task}>
                    {task}
                  </option>
                ))
              }
            </select>
          </div>
          <div>
            <label for="ConfigSelect">Configuration template</label>
            <select name="ConfigSelect" id="ConfigSelect" onChange={(e) => handleChangeConfig(e)}>
              {
                Object.entries(configList).map(([config, cfgContent]) => (
                  <option key={config} value={config}>
                    {config}
                  </option>
                ))
              }
            </select>
          </div>
          <TextAreaContainer>
            <TextAreaComponent ref={configTextAreaRef} spellCheck="false" onChange={(e) => handleChangeConfigContent(e)} />
          </TextAreaContainer>
        </RowContainer>
      </fieldset>

      <fieldset>
          <legend>Action</legend>
          <RowContainer>
            <div>
              <input type="checkbox" id="RunVisualization" />
              <label for="RunVisualization" >Run Visualization after current task</label>
            </div>
            <div>
              <input type="submit" value="Run" onClick={handleRunClick} />
              <input type="submit" value="Visualize" />
              <input type="submit" value="Clean" onClick={handleCleanClick} />
            </div>
          </RowContainer>
        </fieldset>
    </form>
  </Container>
}

export default function TaskConfig(props) {
  return <Container>
    <Global styles={{
      'body': {
        overflowY: 'scroll'
      }
    }} />
    <div style={{ position: 'relative' }}>
      <AppHeader>
        <img src={Logo} alt='' />

        <AppIntro>
          <FormattedMessage id='app-intro' />
        </AppIntro>
      </AppHeader>

      <WorldContainer>
        <ColumnContainerCfg>
          <TaskConfigSection>
            <TaskConfigParamComponent/>
          </TaskConfigSection>
        </ColumnContainerCfg>

        <ColumnContainerLuigiStatus>
          <IFrameComponent />
        </ColumnContainerLuigiStatus>
      </WorldContainer>
    </div>
  </Container>
}