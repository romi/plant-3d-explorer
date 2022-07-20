export default class Object3DBase
{
    constructor(parent, geometry, settings)
    {
        if(!parent || !geometry || !settings)
            console.error("A 3D Object should have a parent, a geometry and settings");
        this.parent = parent;
        this.geometry = geometry;
        this.settings = settings;
        this.object = null;
    }

    setSettings(settings)
    {
        this.settings = settings
    }
}