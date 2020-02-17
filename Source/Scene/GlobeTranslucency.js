import defineProperties from '../Core/defineProperties.js';
import destroyObject from '../Core/destroyObject.js';
import defined from '../Core/defined.js';
import DrawCommand from '../Renderer/DrawCommand.js';

    /**
     * @private
     */
    function GlobeTranslucency() {
        this._colorTexture = undefined;
        this._depthTexture = undefined;
    }

    defineProperties(GlobeTranslucency.prototype, {
        command : {
            get : function() {
                return this._translucentCommand;
            }
        }
    });

    GlobeTranslucency.prototype.isDestroyed = function() {
        return false;
    };

    GlobeTranslucency.prototype.destroy = function() {
        return destroyObject(this);
    };

    functon getBackFaceShaderProgram(context, shaderProgram) {
        // Needs to use dark fog
    }

    function getFrontFaceShaderProgram(context, shaderProgram) {
        // Needs to use regular fog
    }

    function getBackFaceRenderState(context) {
        // Move pickRenderStateCache, depthOnlyRenderStateCache, and this new cache to context
    }

    GlobeTranslucency.updateDerivedCommand = function(command) {
        var derivedCommands = command.derivedCommands.globeTranslucency;

        if (!defined(derivedCommands) || command.dirty) {
            command.dirty = false;

            derivedCommands = defined(derivedCommands) ? derivedCommands : {};
            var backFaceCommand = derivedCommands.backFaceCommand;
            var frontFaceCommand = derivedCommands.frontFaceCommand;

            var backFaceShader;
            var backFaceRenderState;
            var frontFaceShader;
            var frontFaceRenderState;

            if (defined(backFaceCommand)) {
                backFaceShader = backFaceCommand.shaderProgram;
                backFaceRenderState = backFaceCommand.renderState;
                frontFaceShader = frontFaceCommand.shaderProgram;
                frontFaceRenderState = frontFaceCommand.renderState;
            }

            backFaceCommand = DrawCommand.shallowClone(command, backFaceCommand);
            frontFaceCommand = DrawCommand.shallowClone(command, frontFaceCommand);

            derivedCommands.backFaceCommand = backFaceCommand;
            derivedCommands.frontFaceCommand = frontFaceCommand;

            if (!defined(backFaceShader) || (derivedCommands.shaderProgramId !== command.shaderProgram.id)) {
                derivedCommands.shaderProgramId = command.shaderProgram.id;
                backFaceCommand.shaderProgram = getBackFaceShaderProgram(context, command.shaderProgram);
                backFaceCommand.renderState = getBackFaceRenderState(scene, command.renderState);
                frontFaceCommand.shaderProgram = getFrontFaceShaderProgram(context, command.shaderProgram);
                frontFaceCommand.renderState = getFrontFaceRenderState(scene, command.renderState);
            } else {
                backFaceCommand.shaderProgram = backFaceShader;
                backFaceCommand.renderState = backFaceRenderState;
                frontFaceCommand.shaderProgram = frontFaceShader;
                frontFaceCommand.renderState = frontFaceRenderState;
            }
        }
    };

    GlobeTranslucency.prototype.executeGlobeCommands = function(commands, length, clearGlobeDepth, executeCommandFunction, passState) {
        var i;

        // Execute back face commands
        for (i = 0; i < length; i += 2)
        {
            executeCommandFunction(commands[i], scene, context, passState);
        }

        var originalFramebuffer = passState.framebuffer;
        passState.framebuffer = this.framebuffer;

        // Execute front face commands
        for (var i = 1; i < length; i+= 2)
        {
            executeCommandFunction(commands[i], scene, context, passState);
        }

        passState.framebuffer = originalFramebuffer;

        if (clearGlobeDepth) {
            // Use passState.framebuffer.depthTexture?
            globeTranslucency.executeDepthTest(globeDepth.depthTexture); // TODO
        }


        // Create derived commands
        // Modify behavior based on fog and depthTestAgainstTerrain and logDepth and such
        // Clear stencil
    };

    GlobeTranslucency.prototype.executeClassificationCommands = function(commands, executeCommandFunction, passState) {
        // Applies classification to front faces only. Back faces are already classified in Scene.
        var originalFramebuffer = passState.framebuffer;
        passState.framebuffer = this.framebuffer;

        for (var i = 0; i < length; ++i) {
            executeCommand(commands[i], scene, context, passState);
        }

        passState.framebuffer = originalFramebuffer;
        // Need to clear stencil
    };

    GlobeTranslucency.prototype.updateCommand = function(passState) {
        var framebuffer = passState.framebuffer;
        var depthTexture = defaultValue(framebuffer.depthStencilTexture, framebuffer.depthTexture);
        // Discard pixels that are behind the given depth texture
        // Called twice for depthTestAgainstTerrain = false, once otherwise
        return this._translucentCommand;
    };

    GlobeTranslucency.prototype.execute = function(globeCommands, sceneDepthTexture) {
        // Execute translucent command in either OIT pass or non-OIT pass
    };

    GlobeTranslucency.isSupported = function(context) {
        return context.depthTexture;
    };

export default GlobeTranslucency;
