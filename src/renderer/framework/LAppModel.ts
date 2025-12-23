import { CubismUserModel } from './model/cubismusermodel';
import { CubismModelSettingJson } from './cubismmodelsettingjson';
import { LAppTextureManager } from './LAppTextureManager';
import { CubismDefaultParameterId } from './cubismdefaultparameterid';
import { CubismFramework } from './live2dcubismframework';
import { CubismMatrix44 } from './math/cubismmatrix44';

export class LAppModel extends CubismUserModel {
    private _modelSetting: CubismModelSettingJson | null = null;
    private _modelHomeDir: string = '';
    private _isLoaded: boolean = false;

    // Hair movement tracking
    private _lastMouseX: number = 0;
    private _lastMouseY: number = 0;
    private _hairSwayX: number = 0;
    private _hairSwayY: number = 0;

    constructor() {
        super();
        this._modelSetting = null;
        this._isLoaded = false;
    }

    public async loadAssets(dir: string, fileName: string, textureManager: LAppTextureManager, gl: WebGLRenderingContext): Promise<void> {
        try {
            this._modelHomeDir = dir;
            window.electronAPI.log(`LAppModel.loadAssets: Starting load from ${dir}${fileName}`);

            const path = `${dir}${fileName}`;
            const response = await fetch(path);
            if (!response.ok) throw new Error(`Model request failed: ${response.status}`);
            const arrayBuffer = await response.arrayBuffer();

            this._modelSetting = new CubismModelSettingJson(arrayBuffer, arrayBuffer.byteLength);

            // Load moc3
            const mocFileName = this._modelSetting.getModelFileName();
            if (mocFileName != '') {
                const mocPath = `${this._modelHomeDir}${mocFileName}`;
                window.electronAPI.log(`LAppModel.loadAssets: Loading moc3 from ${mocPath}`);
                const mocResp = await fetch(mocPath);
                if (!mocResp.ok) throw new Error(`Moc request failed: ${mocResp.status}`);
                const mocBuffer = await mocResp.arrayBuffer();
                this.loadModel(mocBuffer);
            }

            // Create Renderer
            window.electronAPI.log('LAppModel.loadAssets: Creating renderer');
            this.createRenderer();
            this.getRenderer().startUp(gl);
            this.getRenderer().setIsPremultipliedAlpha(true);

            // Load Textures
            const textureCount = this._modelSetting.getTextureCount();
            window.electronAPI.log(`LAppModel.loadAssets: Loading ${textureCount} textures`);
            for (let i = 0; i < textureCount; i++) {
                const textureFileName = this._modelSetting.getTextureFileName(i);
                const texturePath = `${this._modelHomeDir}${textureFileName}`;
                window.electronAPI.log(`LAppModel.loadAssets: Loading texture[${i}] from ${texturePath}`);

                const textureInfo = await textureManager.createTextureFromPngFile(gl, texturePath, true);
                if (!textureInfo) throw new Error(`Texture load failed: ${texturePath}`);
                this.getRenderer().bindTexture(i, textureInfo.id);
            }

            // Load Physics
            const physicsFileName = this._modelSetting.getPhysicsFileName();
            if (physicsFileName != '') {
                const physicsPath = `${this._modelHomeDir}${physicsFileName}`;
                window.electronAPI.log(`LAppModel.loadAssets: Loading physics from ${physicsPath}`);
                const physicsResp = await fetch(physicsPath);
                if (physicsResp.ok) {
                    const physicsBuffer = await physicsResp.arrayBuffer();
                    this.loadPhysics(physicsBuffer, physicsBuffer.byteLength);
                }
            }

            // Load Pose (controls which parts are visible, e.g., arm variations)
            const poseFileName = this._modelSetting.getPoseFileName();
            if (poseFileName != '') {
                const posePath = `${this._modelHomeDir}${poseFileName}`;
                window.electronAPI.log(`LAppModel.loadAssets: Loading pose from ${posePath}`);
                const poseResp = await fetch(posePath);
                if (poseResp.ok) {
                    const poseBuffer = await poseResp.arrayBuffer();
                    this.loadPose(poseBuffer, poseBuffer.byteLength);
                }
            }

            // Adjust model's size and position - center in viewport
            // The viewport range is -1 to 1, so we need to scale appropriately
            this._modelMatrix.setHeight(2.0);
            // Center the model (don't offset to bottom)
            this._modelMatrix.setY(0);

            this._isLoaded = true;
            window.electronAPI.log(`LAppModel.loadAssets: Live2D Model Loaded Successfully: ${fileName}`);
        } catch (e: any) {
            window.electronAPI.log(`LAppModel.loadAssets error: ${e.message || e}`);
            console.error('LAppModel.loadAssets error:', e);
            this._isLoaded = false;
        }
    }

    public update(deltaTimeSeconds: number, mouseX: number = 0, mouseY: number = 0): void {
        if (!this._isLoaded || !this.getModel()) return;

        const model = this.getModel();
        model.loadParameters();

        // Apply mouse tracking for head and eye movement
        // mouseX, mouseY are in range -1 to 1

        // Head rotation (ParamAngleX: -30 to 30, ParamAngleY: -30 to 30)
        const headAngleX = mouseX * 30; // Left-right rotation
        const headAngleY = mouseY * 30; // Up-down rotation

        // Eye ball movement (ParamEyeBallX: -1 to 1, ParamEyeBallY: -1 to 1)
        const eyeBallX = mouseX;
        const eyeBallY = mouseY;

        // Body slight rotation (ParamBodyAngleX: -10 to 10)
        const bodyAngleX = mouseX * 10;

        // Hair sway based on mouse movement velocity
        const mouseVelocityX = (mouseX - this._lastMouseX) * 10; // Reduced from 30
        const mouseVelocityY = (mouseY - this._lastMouseY) * 10;
        this._lastMouseX = mouseX;
        this._lastMouseY = mouseY;

        // Apply velocity to hair sway with damping for smooth motion
        const dampingFactor = 0.95; // Increased for slower decay (was 0.85)
        const swayStrength = 0.5;   // Reduced for gentler movement (was 2.0)
        this._hairSwayX = this._hairSwayX * dampingFactor + mouseVelocityX * swayStrength;
        this._hairSwayY = this._hairSwayY * dampingFactor + mouseVelocityY * swayStrength;

        // Clamp hair sway values to valid range (-1 to 1)
        this._hairSwayX = Math.max(-1, Math.min(1, this._hairSwayX));
        this._hairSwayY = Math.max(-1, Math.min(1, this._hairSwayY));

        // Set parameters using CubismId
        const idManager = CubismFramework.getIdManager();

        model.setParameterValueById(idManager.getId(CubismDefaultParameterId.ParamAngleX), headAngleX);
        model.setParameterValueById(idManager.getId(CubismDefaultParameterId.ParamAngleY), headAngleY);
        model.setParameterValueById(idManager.getId(CubismDefaultParameterId.ParamEyeBallX), eyeBallX);
        model.setParameterValueById(idManager.getId(CubismDefaultParameterId.ParamEyeBallY), eyeBallY);
        model.setParameterValueById(idManager.getId(CubismDefaultParameterId.ParamBodyAngleX), bodyAngleX);

        // Apply hair sway
        model.setParameterValueById(idManager.getId(CubismDefaultParameterId.ParamHairFront), this._hairSwayX);
        model.setParameterValueById(idManager.getId(CubismDefaultParameterId.ParamHairSide), this._hairSwayX * 0.7);
        model.setParameterValueById(idManager.getId(CubismDefaultParameterId.ParamHairBack), this._hairSwayX * 0.5);

        // Apply pose to control which parts are visible
        if (this._pose != null) {
            this._pose.updateParameters(model, deltaTimeSeconds);
        }

        model.saveParameters();
        model.update();
    }

    public draw(matrix: CubismMatrix44): void {
        if (!this._isLoaded || this._model == null || this.getRenderer() == null) {
            return;
        }

        // matrix.multiplyByMatrix(m) computes: m * matrix (and stores in matrix)
        // So this gives: modelMatrix * projection, which for column-major is the correct MVP order
        matrix.multiplyByMatrix(this._modelMatrix);

        this.getRenderer().setMvpMatrix(matrix);
        this.getRenderer().drawModel();
    }

    /**
     * Set the model's scale and Y position
     * @param scale Model height scale (2.0 = full body, 4.0 = upper body zoom)
     * @param offsetY Y offset (-0.5 = shift down to show upper body)
     */
    public setModelTransform(scale: number, offsetY: number): void {
        this._modelMatrix.setHeight(scale);
        this._modelMatrix.setY(offsetY);
    }
}
