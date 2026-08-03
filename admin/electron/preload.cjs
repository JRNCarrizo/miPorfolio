const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('adminApi', {
  getAll: () => ipcRenderer.invoke('content:getAll'),
  saveProfile: (profile) => ipcRenderer.invoke('content:saveProfile', profile),
  saveProjects: (projects) => ipcRenderer.invoke('content:saveProjects', projects),
  saveSkills: (skills) => ipcRenderer.invoke('content:saveSkills', skills),
  uploadImage: (opts) => ipcRenderer.invoke('content:uploadImage', opts),
  uploadCv: () => ipcRenderer.invoke('content:uploadCv'),
  publish: (message) => ipcRenderer.invoke('git:publish', message),
  openWebDev: () => ipcRenderer.invoke('app:openWebDev'),
  openExternal: (url) => ipcRenderer.invoke('app:openExternal', url),
  getPaths: () => ipcRenderer.invoke('app:getPaths'),
})
