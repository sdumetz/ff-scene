/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import * as THREE from "three";

import { types } from "@ff/graph/propertyTypes";

import CLight from "./CLight";

////////////////////////////////////////////////////////////////////////////////

const _inputs = {
    position: types.Vector3("Light.Position", [ 0, 1, 0 ]),
    target: types.Vector3("Light.Target"),
    shadowSize: types.Number("Shadow.Size", 100),
};

export default class CDirectionalLight extends CLight
{
    static readonly typeName: string = "CDirectionalLight";

    ins = this.addInputs<CLight, typeof _inputs>(_inputs);

    get light(): THREE.DirectionalLight
    {
        return this.object3D as THREE.DirectionalLight;
    }

    create()
    {
        super.create();
        this.object3D = new THREE.DirectionalLight();
    }

    update(context)
    {
        super.update(context);

        const light = this.light;
        const ins = this.ins;

        if (ins.position.changed || ins.target.changed) {
            light.position.fromArray(ins.position.value);
            light.target.position.fromArray(ins.target.value);
            light.updateMatrix();
        }

        if (ins.shadowSize.changed) {
            const camera = light.shadow.camera;
            const halfSize = ins.shadowSize.value * 0.5;
            camera.left = camera.bottom = -halfSize;
            camera.right = camera.top = halfSize;
            camera.updateProjectionMatrix();
        }

        return true;
    }
}