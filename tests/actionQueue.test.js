import test from "node:test";
import assert from "node:assert/strict";

import {
    addAction,
    removeAction,
    processActionQueue
} from "../js/actionQueue.js";

import { game } from "../js/gameState.js";

function createLife() {
    return structuredClone(game.life);
}

/*

Tests to implement

Function	    Test	                    Expected behavior
addAction	    Missing action	            Throws "Action missing"
	            Missing actionType	        Throws "Action must have an actionType"
	            Valid action	            Adds action to queue and logs activity started
removeAction	Invalid index	            Throws "Invalid action queue index"
	            Valid index	                Removes and returns action
	            abandoned = true	        Removes action and logs abandonment
	            Default abandoned	        Removes action without abandonment log
processActionQueue	Invalid hours	        Rejects negative, non-numeric, and non-finite values
	            Empty queue	                Returns all available hours
	            Unknown action type	        Throws an error
	            Already employed in target	Removes redundant action without consuming hours
	            Ineligible job search	    Leaves action queued and preserves hours
	            Eligible, incomplete search	Advances progress and consumes available hours
	            Completed job search	    Removes action, assigns job, and logs completion
	            Multiple actions	        Skips ineligible actions and processes later eligible ones
*/