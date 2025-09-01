// This file is a modified copy of the file served via https:/*.fandom.com/load.php?cb=20250729184643&lang=en&modules=startup&only=scripts&raw=1&skin=fandomdesktop

/**
 * This file is where we decide whether to initialise the modern support browser run-time.
 *
 * - Beware: This file MUST parse without errors on even the most ancient of browsers!
 */
/* eslint-disable no-implicit-globals */
/* global $CODE, RLQ:true, NORLQ:true */

/**
 * See <https://www.mediawiki.org/wiki/Compatibility#Browsers>
 *
 * Browsers that pass these checks get served our modern run-time. This includes all Grade A
 * browsers, and some Grade C and Grade X browsers.
 *
 * The following browsers are known to pass these checks:
 * - Chrome 63+
 * - Edge 79+
 * - Opera 50+
 * - Firefox 58+
 * - Safari 11.1+
 * - Mobile Safari 11.2+ (iOS 11+)
 * - Android 5.0+
 *
 * @private
 * @return {boolean} User agent is compatible with MediaWiki JS
 */
function isCompatible() {
	return !!(
		// Ensure DOM Level 4 features (including Selectors API).
		//
		// https://caniuse.com/#feat=queryselector
		'querySelector' in document &&

		// Ensure HTML 5 features (including Web Storage API)
		//
		// https://caniuse.com/#feat=namevalue-storage
		// https://blog.whatwg.org/this-week-in-html-5-episode-30
		'localStorage' in window &&

		// Ensure ES2015 grammar and runtime API (a.k.a. ES6)
		//
		// In practice, Promise.finally is a good proxy for overall ES6 support and
		// rejects most unsupporting browsers in one sweep. The feature itself
		// was specified in ES2018, however.
		// https://caniuse.com/promise-finally
		// Chrome 63+, Edge 18+, Opera 50+, Safari 11.1+, Firefox 58+, iOS 11+
		//
		// eslint-disable-next-line es-x/no-promise, es-x/no-promise-prototype-finally, dot-notation
		typeof Promise === 'function' && Promise.prototype[ 'finally' ] &&
		// ES6 Arrow Functions (with default params), this ensures
		// genuine syntax support for ES6 grammar, not just API coverage.
		//
		// https://caniuse.com/arrow-functions
		// Chrome 45+, Safari 10+, Firefox 22+, Opera 32+
		//
		// Based on Benjamin De Cock's snippet here:
		// https://gist.github.com/bendc/d7f3dbc83d0f65ca0433caf90378cd95
		( function () {
			try {
				// eslint-disable-next-line no-new, no-new-func
				new Function( '(a = 0) => a' );
				return true;
			} catch ( e ) {
				return false;
			}
		}() ) &&
		// ES6 RegExp.prototype.flags
		//
		// https://caniuse.com/mdn-javascript_builtins_regexp_flags
		// Edge 79+ (Chromium-based, rejects MSEdgeHTML-based Edge <= 18)
		//
		// eslint-disable-next-line es-x/no-regexp-prototype-flags
		/./g.flags === 'g'
	);
}

if ( !isCompatible() ) {
	// Handle basic supported browsers (Grade C).
	// Undo speculative modern (Grade A) root CSS class `<html class="client-js">`.
	// See ResourceLoaderClientHtml::getDocumentAttributes().
	document.documentElement.className = document.documentElement.className
		.replace( /(^|\s)client-js(\s|$)/, '$1client-nojs$2' );

	// Process any callbacks for basic support (Grade C).
	while ( window.NORLQ && NORLQ[ 0 ] ) {
		NORLQ.shift()();
	}
	NORLQ = {
		push: function ( fn ) {
			fn();
		}
	};

	// Clear and disable the modern (Grade A) queue.
	RLQ = {
		push: function () {}
	};
} else {
	// Handle modern (Grade A).

	if ( window.performance && performance.mark ) {
		performance.mark( 'mwStartup' );
	}

	// This embeds mediawiki.js, which defines 'mw' and 'mw.loader'.
	/**
 * Base library for MediaWiki.
 */
/* global $CODE */

( function () {
	'use strict';

	var con = window.console;

	/**
	 * @class mw.Map
	 * @classdesc Collection of values by string keys.
	 *
	 * This is an internal class that backs the mw.config and mw.messages APIs.
	 *
	 * It allows reading and writing to the collection via public methods,
	 * and allows batch iteraction for all its methods.
	 *
	 * For mw.config, scripts sometimes choose to "import" a set of keys locally,
	 * like so:
	 *
	 * ```
	 * var conf = mw.config.get( [ 'wgServerName', 'wgUserName', 'wgPageName' ] );
	 * conf.wgServerName; // "example.org"
	 * ```
	 *
	 * Check the existence ("AND" condition) of multiple keys:
	 *
	 * ```
	 * if ( mw.config.exists( [ 'wgFoo', 'wgBar' ] ) );
	 * ```
	 *
	 * For mw.messages, the {@link mw.Map#set} method allows mw.loader and mw.Api to essentially
	 * extend the object, and batch-apply all their loaded values in one go:
	 *
	 * ```
	 * mw.messages.set( { "mon": "Monday", "tue": "Tuesday" } );
	 * ```
	 *
	 * @hideconstructor
	 */
	function Map() {
		this.values = Object.create( null );
	}

	Map.prototype = /** @lends mw.Map.prototype */ {
		constructor: Map,

		/**
		 * Get the value of one or more keys.
		 *
		 * If called with no arguments, all values are returned.
		 *
		 * @param {string|Array} [selection] Key or array of keys to retrieve values for.
		 * @param {any} [fallback=null] Value for keys that don't exist.
		 * @return {any|Object|null} If selection was a string, returns the value,
		 *  If selection was an array, returns an object of key/values.
		 *  If no selection is passed, a new object with all key/values is returned.
		 */
		get: function ( selection, fallback ) {
			if ( arguments.length < 2 ) {
				fallback = null;
			}

			if ( typeof selection === 'string' ) {
				return selection in this.values ?
					this.values[ selection ] :
					fallback;
			}

			var results;
			if ( Array.isArray( selection ) ) {
				results = {};
				for ( var i = 0; i < selection.length; i++ ) {
					if ( typeof selection[ i ] === 'string' ) {
						results[ selection[ i ] ] = selection[ i ] in this.values ?
							this.values[ selection[ i ] ] :
							fallback;
					}
				}
				return results;
			}

			if ( selection === undefined ) {
				results = {};
				for ( var key in this.values ) {
					results[ key ] = this.values[ key ];
				}
				return results;
			}

			// Invalid selection key
			return fallback;
		},

		/**
		 * Set one or more key/value pairs.
		 *
		 * @param {string|Object} selection Key to set value for, or object mapping keys to values
		 * @param {any} [value] Value to set (optional, only in use when key is a string)
		 * @return {boolean} True on success, false on failure
		 */
		set: function ( selection, value ) {
			// Use `arguments.length` because `undefined` is also a valid value.
			if ( arguments.length > 1 ) {
				// Set one key
				if ( typeof selection === 'string' ) {
					this.values[ selection ] = value;
					return true;
				}
			} else if ( typeof selection === 'object' ) {
				// Set multiple keys
				for ( var key in selection ) {
					this.values[ key ] = selection[ key ];
				}
				return true;
			}
			return false;
		},

		/**
		 * Check if a given key exists in the map.
		 *
		 * @param {string} selection Key to check
		 * @return {boolean} True if the key exists
		 */
		exists: function ( selection ) {
			return typeof selection === 'string' && selection in this.values;
		}
	};

	/**
	 * Write a verbose message to the browser's console in debug mode.
	 *
	 * In ResourceLoader debug mode, this writes to the browser's console.
	 * In production mode, it is a no-op.
	 *
	 * See {@link mw.log} for other logging methods.
	 *
	 * @memberof mw
	 * @variation 2
	 * @param {...string} msg Messages to output to console.
	 */
	var log = function () {
		
	};

	/**
	 * Write a message to the browser console's warning channel.
	 *
	 * @memberof mw.log
	 * @method warn
	 * @param {...string} msg Messages to output to console
	 */
	log.warn = Function.prototype.bind.call( con.warn, con );

	/**
	 * Base library for MediaWiki.
	 *
	 * Exposed globally as `mw`, with `mediaWiki` as alias. `mw` code can be considered stable and follows the
	 * [frontend stable interface policy](https://www.mediawiki.org/wiki/Special:MyLanguage/Stable_interface_policy/Frontend).
	 *
	 * @namespace mw
	 */
	var mw = /** @lends mw */ {
		/**
		 * Get the current time, measured in milliseconds since January 1, 1970 (UTC).
		 *
		 * On browsers that implement the Navigation Timing API, this function will produce
		 * floating-point values with microsecond precision that are guaranteed to be monotonic.
		 * On all other browsers, it will fall back to using `Date`.
		 *
		 * @return {number} Current time
		 */
		now: function () {
			// Optimisation: Cache and re-use the chosen implementation.
			// Optimisation: Avoid startup overhead by re-defining on first call instead of IIFE.
			var perf = window.performance;
			var navStart = perf && perf.timing && perf.timing.navigationStart;

			// Define the relevant shortcut
			mw.now = navStart && perf.now ?
				function () {
					return navStart + perf.now();
				} :
				Date.now;

			return mw.now();
		},

		/**
		 * List of all analytic events emitted so far.
		 *
		 * Exposed only for use by mediawiki.base.
		 *
		 * @private
		 * @property {Array}
		 */
		trackQueue: [],

		/**
		 * Track `'resourceloader.exception'` event and send it to the window console.
		 *
		 * This exists for internal use by mw.loader only, to remember and buffer
		 * very early events for `mw.trackSubscribe( 'resourceloader.exception' )`
		 * even while `mediawiki.base` and `mw.track` are still in-flight.
		 *
		 * @private
		 * @param {Object} data
		 * @param {Error} [data.exception]
		 * @param {string} data.source Error source
		 * @param {string} [data.module] Name of module which caused the error
		 */
		trackError: function ( data ) {
			if ( mw.track ) {
				mw.track( 'resourceloader.exception', data );
			} else {
				mw.trackQueue.push( { topic: 'resourceloader.exception', data: data } );
			}

			// Log an error message to window.console, even in production mode.
			var e = data.exception;
			var msg = ( e ? 'Exception' : 'Error' ) +
				' in ' + data.source +
				( data.module ? ' in module ' + data.module : '' ) +
				( e ? ':' : '.' );

			con.log( msg );

			// If we have an exception object, log it to the warning channel to trigger
			// proper stacktraces in browsers that support it.
			if ( e ) {
				con.warn( e );
			}
		},

		// Expose mw.Map
		Map: Map,

		/**
		 * Map of configuration values.
		 *
		 * Check out [the complete list of configuration values](https://www.mediawiki.org/wiki/Manual:Interface/JavaScript#mw.config)
		 * on mediawiki.org.
		 *
		 * @type {mw.Map}
		 */
		config: new Map(),

		/**
		 * Store for messages.
		 *
		 * @type {mw.Map}
		 */
		messages: new Map(),

		/**
		 * Store for templates associated with a module.
		 *
		 * @type {mw.Map}
		 */
		templates: new Map(),

		// Expose mw.log
		log: log

		// mw.loader is defined in a separate file that is appended to this
	};

	// Attach to window and globally alias
	window.mw = window.mediaWiki = mw;

	window.QUnit = undefined;
}() );
/*!
 * Defines mw.loader, the infrastructure for loading ResourceLoader
 * modules.
 *
 * This file is appended directly to the code in startup/mediawiki.js
 */
/* global $VARS, $CODE, mw */

( function () {
	'use strict';

	var store,
		hasOwn = Object.hasOwnProperty;

	/**
	 * Client for ResourceLoader server end point.
	 *
	 * This client is in charge of maintaining the module registry and state
	 * machine, initiating network (batch) requests for loading modules, as
	 * well as dependency resolution and execution of source code.
	 *
	 * @see <https://www.mediawiki.org/wiki/ResourceLoader/Features>
	 * @namespace mw.loader
	 */

	/**
	 * FNV132 hash function
	 *
	 * This function implements the 32-bit version of FNV-1.
	 * It is equivalent to hash( 'fnv132', ... ) in PHP, except
	 * its output is base 36 rather than hex.
	 * See <https://en.wikipedia.org/wiki/Fowler–Noll–Vo_hash_function>
	 *
	 * @private
	 * @param {string} str String to hash
	 * @return {string} hash as a five-character base 36 string
	 */
	function fnv132( str ) {
		var hash = 0x811C9DC5;

		/* eslint-disable no-bitwise */
		for ( var i = 0; i < str.length; i++ ) {
			hash += ( hash << 1 ) + ( hash << 4 ) + ( hash << 7 ) + ( hash << 8 ) + ( hash << 24 );
			hash ^= str.charCodeAt( i );
		}

		hash = ( hash >>> 0 ).toString( 36 ).slice( 0, 5 );
		/* eslint-enable no-bitwise */

		while ( hash.length < 5 ) {
			hash = '0' + hash;
		}
		return hash;
	}

	/**
	 * Fired via mw.track on various resource loading errors.
	 *
	 * eslint-disable jsdoc/valid-types
	 *
	 * @event ~'resourceloader.exception'
	 * @ignore
	 * @param {Error|Mixed} e The error that was thrown. Almost always an Error
	 *   object, but in theory module code could manually throw something else, and that
	 *   might also end up here.
	 * @param {string} [module] Name of the module which caused the error. Omitted if the
	 *   error is not module-related or the module cannot be easily identified due to
	 *   batched handling.
	 * @param {string} source Source of the error. Possible values:
	 *
	 *   - load-callback: exception thrown by user callback
	 *   - module-execute: exception thrown by module code
	 *   - resolve: failed to sort dependencies for a module in mw.loader.load
	 *   - store-eval: could not evaluate module code cached in localStorage
	 *   - store-localstorage-json: JSON conversion error in mw.loader.store
	 *   - store-localstorage-update: localStorage conversion error in mw.loader.store.
	 */

	/**
	 * Mapping of registered modules.
	 *
	 * See #implement and #execute for exact details on support for script, style and messages.
	 *
	 * @example // Format:
	 * {
	 *     'moduleName': {
	 *         // From mw.loader.register()
	 *         'version': '#####' (five-character hash)
	 *         'dependencies': ['required.foo', 'bar.also', ...]
	 *         'group': string, integer, (or) null
	 *         'source': 'local', (or) 'anotherwiki'
	 *         'skip': 'return !!window.Example;', (or) null, (or) boolean result of skip
	 *         'module': export Object
	 *
	 *         // Set by execute() or mw.loader.state()
	 *         // See mw.loader.getState() for documentation of the state machine
	 *         'state': 'registered', 'loading', 'loaded', 'executing', 'ready', 'error', or 'missing'
	 *
	 *         // Optionally added at run-time by mw.loader.impl()
	 *         'script': closure, array of urls, or string
	 *         'style': { ... } (see #execute)
	 *         'messages': { 'key': 'value', ... }
	 *     }
	 * }
	 *
	 * @property {Object}
	 * @private
	 */
	var registry = new Map(),
		// Mapping of sources, keyed by source-id, values are strings.
		//
		// Format:
		//
		//     {
		//         'sourceId': 'http://example.org/w/load.php'
		//     }
		//
		sources = Object.create( null ),

		// For queueModuleScript()
		handlingPendingRequests = false,
		pendingRequests = [],

		// List of modules to be loaded
		queue = [],

		/**
		 * List of callback jobs waiting for modules to be ready.
		 *
		 * Jobs are created by #enqueue() and run by #doPropagation().
		 * Typically when a job is created for a module, the job's dependencies contain
		 * both the required module and all its recursive dependencies.
		 *
		 * @example // Format:
		 * {
		 *     'dependencies': [ module names ],
		 *     'ready': Function callback
		 *     'error': Function callback
		 * }
		 *
		 * @property {Object[]} jobs
		 * @private
		 */
		jobs = [],

		// For #setAndPropagate() and #doPropagation()
		willPropagate = false,
		errorModules = [],

		/**
		 * @private
		 * @property {Array} baseModules
		 */
		baseModules = ["jquery","mediawiki.base"],

		/**
		 * For #addEmbeddedCSS() and #addLink()
		 *
		 * @private
		 * @property {HTMLElement|null} marker
		 */
		marker = document.querySelector( 'meta[name="ResourceLoaderDynamicStyles"]' ),

		// For #addEmbeddedCSS()
		lastCssBuffer;

	/**
	 * Append an HTML element to `document.head` or before a specified node.
	 *
	 * @private
	 * @param {HTMLElement} el
	 * @param {Node|null} [nextNode]
	 */
	function addToHead( el, nextNode ) {
		if ( nextNode && nextNode.parentNode ) {
			nextNode.parentNode.insertBefore( el, nextNode );
		} else {
			document.head.appendChild( el );
		}
	}

	/**
	 * Create a new style element and add it to the DOM.
	 * Stable for use in gadgets.
	 *
	 * @method mw.loader.addStyleTag
	 * @param {string} text CSS text
	 * @param {Node|null} [nextNode] The element where the style tag
	 *  should be inserted before
	 * @return {HTMLStyleElement} Reference to the created style element
	 */
	function newStyleTag( text, nextNode ) {
		var el = document.createElement( 'style' );
		el.appendChild( document.createTextNode( text ) );
		addToHead( el, nextNode );
		return el;
	}

	/**
	 * @private
	 * @param {Object} cssBuffer
	 */
	function flushCssBuffer( cssBuffer ) {
		// Make sure the next call to addEmbeddedCSS() starts a new buffer.
		// This must be done before we run the callbacks, as those may end up
		// queueing new chunks which would be lost otherwise (T105973).
		//
		// There can be more than one buffer in-flight (given "@import", and
		// generally due to race conditions). Only tell addEmbeddedCSS() to
		// start a new buffer if we're currently flushing the last one that it
		// started. If we're flushing an older buffer, keep the last one open.
		if ( cssBuffer === lastCssBuffer ) {
			lastCssBuffer = null;
		}
		newStyleTag( cssBuffer.cssText, marker );
		for ( var i = 0; i < cssBuffer.callbacks.length; i++ ) {
			cssBuffer.callbacks[ i ]();
		}
	}

	/**
	 * Add a bit of CSS text to the current browser page.
	 *
	 * The creation and insertion of the `<style>` element is debounced for two reasons:
	 *
	 * - Performing the insertion before the next paint round via requestAnimationFrame
	 *   avoids forced or wasted style recomputations, which are expensive in browsers.
	 * - Reduce how often new stylesheets are inserted by letting additional calls to this
	 *   function accumulate into a buffer for at least one JavaScript tick. Modules are
	 *   received from the server in batches, which means there is likely going to be many
	 *   calls to this function in a row within the same tick / the same call stack.
	 *   See also T47810.
	 *
	 * @private
	 * @param {string} cssText CSS text to be added in a `<style>` tag.
	 * @param {Function} callback Called after the insertion has occurred.
	 */
	function addEmbeddedCSS( cssText, callback ) {
		// Start a new buffer if one of the following is true:
		// - We've never started a buffer before, this will be our first.
		// - The last buffer we created was flushed meanwhile, so start a new one.
		// - The next CSS chunk syntactically needs to be at the start of a stylesheet (T37562).
		if ( !lastCssBuffer || cssText.startsWith( '@import' ) ) {
			lastCssBuffer = {
				cssText: '',
				callbacks: []
			};
			requestAnimationFrame( flushCssBuffer.bind( null, lastCssBuffer ) );
		}

		// Linebreak for somewhat distinguishable sections
		lastCssBuffer.cssText += '\n' + cssText;
		lastCssBuffer.callbacks.push( callback );
	}

	/**
	 * See also `ResourceLoader.php#makeVersionQuery` on the server.
	 *
	 * @private
	 * @param {string[]} modules List of module names
	 * @return {string} Hash of concatenated version hashes.
	 */
	function getCombinedVersion( modules ) {
		var hashes = modules.reduce( function ( result, module ) {
			return result + registry.get( module ).version;
		}, '' );
		return fnv132( hashes );
	}

	/**
	 * Determine whether all dependencies are in state 'ready', which means we may
	 * execute the module or job now.
	 *
	 * @private
	 * @param {string[]} modules Names of modules to be checked
	 * @return {boolean} True if all modules are in state 'ready', false otherwise
	 */
	function allReady( modules ) {
		for ( var i = 0; i < modules.length; i++ ) {
			if ( mw.loader.getState( modules[ i ] ) !== 'ready' ) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Determine whether all direct and base dependencies are in state 'ready'
	 *
	 * @private
	 * @param {string} module Name of the module to be checked
	 * @return {boolean} True if all direct/base dependencies are in state 'ready'; false otherwise
	 */
	function allWithImplicitReady( module ) {
		return allReady( registry.get( module ).dependencies ) &&
			( baseModules.indexOf( module ) !== -1 || allReady( baseModules ) );
	}

	/**
	 * Determine whether all dependencies are in state 'ready', which means we may
	 * execute the module or job now.
	 *
	 * @private
	 * @param {string[]} modules Names of modules to be checked
	 * @return {boolean|string} False if no modules are in state 'error' or 'missing';
	 *  failed module otherwise
	 */
	function anyFailed( modules ) {
		for ( var i = 0; i < modules.length; i++ ) {
			var state = mw.loader.getState( modules[ i ] );
			if ( state === 'error' || state === 'missing' ) {
				return modules[ i ];
			}
		}
		return false;
	}

	/**
	 * Handle propagation of module state changes and reactions to them.
	 *
	 * - When a module reaches a failure state, this should be propagated to
	 *   modules that depend on the failed module.
	 * - When a module reaches a final state, pending job callbacks for the
	 *   module from mw.loader.using() should be called.
	 * - When a module reaches the 'ready' state from #execute(), consider
	 *   executing dependent modules now having their dependencies satisfied.
	 * - When a module reaches the 'loaded' state from mw.loader.impl,
	 *   consider executing it, if it has no unsatisfied dependencies.
	 *
	 * @private
	 */
	function doPropagation() {
		var didPropagate = true;
		var module;

		// Keep going until the last iteration performed no actions.
		while ( didPropagate ) {
			didPropagate = false;

			// Stage 1: Propagate failures
			while ( errorModules.length ) {
				var errorModule = errorModules.shift(),
					baseModuleError = baseModules.indexOf( errorModule ) !== -1;
				for ( module in registry ) {
					if ( registry.get( module ).state !== 'error' && registry.get( module ).state !== 'missing' ) {
						if ( baseModuleError && baseModules.indexOf( module ) === -1 ) {
							// Propate error from base module to all regular (non-base) modules
							registry.get( module ).state = 'error';
							didPropagate = true;
						} else if ( registry.get( module ).dependencies.indexOf( errorModule ) !== -1 ) {
							// Propagate error from dependency to depending module
							registry.get( module ).state = 'error';
							// .. and propagate it further
							errorModules.push( module );
							didPropagate = true;
						}
					}
				}
			}

			// Stage 2: Execute 'loaded' modules with no unsatisfied dependencies
			for ( module of registry.keys() ) {
				if ( registry.get( module ).state === 'loaded' && allWithImplicitReady( module ) ) {
					// Recursively execute all dependent modules that were already loaded
					// (waiting for execution) and no longer have unsatisfied dependencies.
					// Base modules may have dependencies amongst eachother to ensure correct
					// execution order. Regular modules wait for all base modules.
					execute( module );
					didPropagate = true;
				}
			}

			// Stage 3: Invoke job callbacks that are no longer blocked
			for ( var i = 0; i < jobs.length; i++ ) {
				var job = jobs[ i ];
				var failed = anyFailed( job.dependencies );
				if ( failed !== false || allReady( job.dependencies ) ) {
					jobs.splice( i, 1 );
					i -= 1;
					try {
						if ( failed !== false && job.error ) {
							job.error( new Error( 'Failed dependency: ' + failed ), job.dependencies );
						} else if ( failed === false && job.ready ) {
							job.ready();
						}
					} catch ( e ) {
						// A user-defined callback raised an exception.
						// Swallow it to protect our state machine!
						mw.trackError( {
							exception: e,
							source: 'load-callback'
						} );
					}
					didPropagate = true;
				}
			}
		}

		willPropagate = false;
	}

	/**
	 * Update a module's state in the registry and make sure any necessary
	 * propagation will occur, by adding a (debounced) call to doPropagation().
	 * See #doPropagation for more about propagation.
	 * See #registry for more about how states are used.
	 *
	 * @private
	 * @param {string} module
	 * @param {string} state
	 */
	function setAndPropagate( module, state ) {
		registry.get( module ).state = state;
		if ( state === 'ready' ) {
			// Queue to later be synced to the local module store.
			store.add( module );
		} else if ( state === 'error' || state === 'missing' ) {
			errorModules.push( module );
		} else if ( state !== 'loaded' ) {
			// We only have something to do in doPropagation for the
			// 'loaded', 'ready', 'error', and 'missing' states.
			// Avoid scheduling and propagation cost for frequent and short-lived
			// transition states, such as 'loading' and 'executing'.
			return;
		}
		if ( willPropagate ) {
			// Already scheduled, or, we're already in a doPropagation stack.
			return;
		}
		willPropagate = true;
		// Yield for two reasons:
		// * Allow successive calls to mw.loader.impl() from the same
		//   load.php response, or from the same asyncEval() to be in the
		//   propagation batch.
		// * Allow the browser to breathe between the reception of
		//   module source code and the execution of it.
		//
		// Use a high priority because the user may be waiting for interactions
		// to start being possible. But, first provide a moment (up to 'timeout')
		// for native input event handling (e.g. scrolling/typing/clicking).
		mw.requestIdleCallback( doPropagation, { timeout: 1 } );
	}

	/**
	 * Resolve dependencies and detect circular references.
	 *
	 * @private
	 * @param {string} module Name of the top-level module whose dependencies shall be
	 *  resolved and sorted.
	 * @param {Array} resolved Returns a topological sort of the given module and its
	 *  dependencies, such that later modules depend on earlier modules. The array
	 *  contains the module names. If the array contains already some module names,
	 *  this function appends its result to the pre-existing array.
	 * @param {Set} [unresolved] Used to detect loops in the dependency graph.
	 * @throws {Error} If an unknown module or a circular dependency is encountered
	 */
	function sortDependencies( module, resolved, unresolved ) {
		if ( !( module in registry ) ) {
			throw new Error( 'Unknown module: ' + module );
		}

		if ( typeof registry.get( module ).skip === 'string' ) {
			// eslint-disable-next-line no-new-func
			var skip = ( new Function( registry.get( module ).skip )() );
			registry.get( module ).skip = !!skip;
			if ( skip ) {
				registry.get( module ).dependencies = [];
				setAndPropagate( module, 'ready' );
				return;
			}
		}

		// Create unresolved if not passed in
		if ( !unresolved ) {
			unresolved = new Set();
		}

		// Track down dependencies
		var deps = registry.get( module ).dependencies;
		unresolved.add( module );
		for ( var i = 0; i < deps.length; i++ ) {
			if ( resolved.indexOf( deps[ i ] ) === -1 ) {
				if ( unresolved.has( deps[ i ] ) ) {
					throw new Error(
						'Circular reference detected: ' + module + ' -> ' + deps[ i ]
					);
				}

				sortDependencies( deps[ i ], resolved, unresolved );
			}
		}

		resolved.push( module );
	}

	/**
	 * Get names of module that a module depends on, in their proper dependency order.
	 *
	 * @private
	 * @param {string[]} modules Array of string module names
	 * @return {Array} List of dependencies, including 'module'.
	 * @throws {Error} If an unregistered module or a dependency loop is encountered
	 */
	function resolve( modules ) {
		// Always load base modules
		var resolved = baseModules.slice();
		for ( var i = 0; i < modules.length; i++ ) {
			sortDependencies( modules[ i ], resolved );
		}
		return resolved;
	}

	/**
	 * Like #resolve(), except it will silently ignore modules that
	 * are missing or have missing dependencies.
	 *
	 * @private
	 * @param {string[]} modules Array of string module names
	 * @return {Array} List of dependencies.
	 */
	function resolveStubbornly( modules ) {
		// Always load base modules
		var resolved = baseModules.slice();
		for ( var i = 0; i < modules.length; i++ ) {
			var saved = resolved.slice();
			try {
				sortDependencies( modules[ i ], resolved );
			} catch ( err ) {
				resolved = saved;
				// This module is not currently known, or has invalid dependencies.
				//
				// Most likely due to a cached reference after the module was
				// removed, otherwise made redundant, or omitted from the registry
				// by the ResourceLoader "target" system.
				//
				// These errors can be common, e.g. queuing an unavailable module
				// unconditionally from the server-side is OK and should fail gracefully.
				mw.log.warn( 'Skipped unavailable module ' + modules[ i ] );

				// Do not track this error as an exception when the module:
				// - Is valid, but gracefully filtered out by target system.
				// - Was recently valid, but is still referenced in stale cache.
				//
				// Basically the only reason to track this as exception is when the error
				// was circular or invalid dependencies. What the above scenarios have in
				// common is that they don't register the module client-side.
				if ( modules[ i ] in registry ) {
					mw.trackError( {
						exception: err,
						source: 'resolve'
					} );
				}
			}
		}
		return resolved;
	}

	/**
	 * Resolve a relative file path.
	 *
	 * For example, resolveRelativePath( '../foo.js', 'resources/src/bar/bar.js' )
	 * returns 'resources/src/foo.js'.
	 *
	 * @private
	 * @param {string} relativePath Relative file path, starting with ./ or ../
	 * @param {string} basePath Path of the file (not directory) relativePath is relative to
	 * @return {string|null} Resolved path, or null if relativePath does not start with ./ or ../
	 */
	function resolveRelativePath( relativePath, basePath ) {

		var relParts = relativePath.match( /^((?:\.\.?\/)+)(.*)$/ );
		if ( !relParts ) {
			return null;
		}

		var baseDirParts = basePath.split( '/' );
		// basePath looks like 'foo/bar/baz.js', so baseDirParts looks like [ 'foo', 'bar, 'baz.js' ]
		// Remove the file component at the end, so that we are left with only the directory path
		baseDirParts.pop();

		var prefixes = relParts[ 1 ].split( '/' );
		// relParts[ 1 ] looks like '../../', so prefixes looks like [ '..', '..', '' ]
		// Remove the empty element at the end
		prefixes.pop();

		// For every ../ in the path prefix, remove one directory level from baseDirParts
		var prefix;
		var reachedRoot = false;
		while ( ( prefix = prefixes.pop() ) !== undefined ) {
			if ( prefix === '..' ) {
				// Once we reach the package's base dir, preserve all remaining "..".
				reachedRoot = !baseDirParts.length || reachedRoot;
				if ( !reachedRoot ) {
					baseDirParts.pop();
				} else {
					baseDirParts.push( prefix );
				}
			}
		}

		// If there's anything left of the base path, prepend it to the file path
		return ( baseDirParts.length ? baseDirParts.join( '/' ) + '/' : '' ) + relParts[ 2 ];
	}

	/**
	 * Make a require() function scoped to a package file
	 *
	 * @private
	 * @param {Object} moduleObj Module object from the registry
	 * @param {string} basePath Path of the file this is scoped to. Used for relative paths.
	 * @return {Function}
	 */
	function makeRequireFunction( moduleObj, basePath ) {
		return function require( moduleName ) {
			var fileName = resolveRelativePath( moduleName, basePath );
			if ( fileName === null ) {
				// Not a relative path, so it's either a module name or,
				// (if in test mode) a private file imported from another module.
				return mw.loader.require( moduleName );
			}

			if ( hasOwn.call( moduleObj.packageExports, fileName ) ) {
				// File has already been executed, return the cached result
				return moduleObj.packageExports[ fileName ];
			}

			var scriptFiles = moduleObj.script.files;
			if ( !hasOwn.call( scriptFiles, fileName ) ) {
				throw new Error( 'Cannot require undefined file ' + fileName );
			}

			var result,
				fileContent = scriptFiles[ fileName ];
			if ( typeof fileContent === 'function' ) {
				var moduleParam = { exports: {} };
				fileContent( makeRequireFunction( moduleObj, fileName ), moduleParam, moduleParam.exports );
				result = moduleParam.exports;
			} else {
				// fileContent is raw data (such as a JSON object), just pass it through
				result = fileContent;
			}
			moduleObj.packageExports[ fileName ] = result;
			return result;
		};
	}

	/**
	 * Load and execute a script.
	 *
	 * @private
	 * @param {string} src URL to script, will be used as the src attribute in the script tag
	 * @param {Function} [callback] Callback to run after request resolution
	 * @param {string[]} [modules] List of modules being requested, for state to be marked as error
	 * in case the script fails to load
	 * @return {HTMLElement}
	 */
	function addScript( src, callback, modules ) {
		// Use a <script> element rather than XHR. Using XHR changes the request
		// headers (potentially missing a cache hit), and reduces caching in general
		// since browsers cache XHR much less (if at all). And XHR means we retrieve
		// text, so we'd need to eval, which then messes up line numbers.
		// The drawback is that <script> does not offer progress events, feedback is
		// only given after downloading, parsing, and execution have completed.
		var script = document.createElement( 'script' );
        // change /load.php sources to /api/wikiassets/${site}/js where site is location.pathname.split("/")[1]
        // safe assumption unless someone pulls out a cross-origin load.php calls for no reason (guess why)
        if ( src.indexOf('/load.php') !== -1 ) {
            var site = location.pathname.split("/")[1];
            src = '/api/wikiassets/' + site + '/js' + src.substring( src.indexOf('?') );
        }

		script.src = src;

		function onComplete() {
			if ( script.parentNode ) {
				script.parentNode.removeChild( script );
			}
			if ( callback ) {
				callback();
				callback = null;
			}
		}
		script.onload = onComplete;
		script.onerror = function () {
			onComplete();
			if ( modules ) {
				for ( var i = 0; i < modules.length; i++ ) {
					setAndPropagate( modules[ i ], 'error' );
				}
			}
		};
		document.head.appendChild( script );
		return script;
	}

	/**
	 * Queue the loading and execution of a script for a particular module.
	 *
	 * This does for legacy debug mode what runScript() does for production.
	 *
	 * @private
	 * @param {string} src URL of the script
	 * @param {string} moduleName Name of currently executing module
	 * @param {Function} callback Callback to run after addScript() resolution
	 */
	function queueModuleScript( src, moduleName, callback ) {
		pendingRequests.push( function () {
			// Keep in sync with execute()/runScript().
			if ( moduleName !== 'jquery' ) {
				window.require = mw.loader.require;
				window.module = registry.get( moduleName ).module;
			}
			addScript( src, function () {
				// 'module.exports' should not persist after the file is executed to
				// avoid leakage to unrelated code. 'require' should be kept, however,
				// as asynchronous access to 'require' is allowed and expected. (T144879)
				delete window.module;
				callback();
				// Start the next one (if any)
				if ( pendingRequests[ 0 ] ) {
					pendingRequests.shift()();
				} else {
					handlingPendingRequests = false;
				}
			} );
		} );
		if ( !handlingPendingRequests && pendingRequests[ 0 ] ) {
			handlingPendingRequests = true;
			pendingRequests.shift()();
		}
	}

	/**
	 * Utility function for execute()
	 *
	 * @ignore
	 * @param {string} url URL
	 * @param {string} [media] Media attribute
	 * @param {Node|null} [nextNode]
	 * @return {HTMLElement}
	 */
	function addLink( url, media, nextNode ) {
		var el = document.createElement( 'link' );

		el.rel = 'stylesheet';
		if ( media ) {
			el.media = media;
		}
		// If you end up here from an IE exception "SCRIPT: Invalid property value.",
		// see #addEmbeddedCSS, T33676, T43331, and T49277 for details.
		el.href = url;

		addToHead( el, nextNode );
		return el;
	}

	/**
	 * Evaluate in the global scope.
	 *
	 * This is used by MediaWiki user scripts, where it is (for example)
	 * important that `var` makes a global variable.
	 *
	 * @private
	 * @param {string} code JavaScript code
	 */
	function globalEval( code ) {
		var script = document.createElement( 'script' );
		script.text = code;
		document.head.appendChild( script );
		script.parentNode.removeChild( script );
	}

	/**
	 * Evaluate JS code using indirect eval().
	 *
	 * This is used by mw.loader.store. It is important that we protect the
	 * integrity of mw.loader's private variables (from accidental clashes
	 * or re-assignment), which means we can't use regular `eval()`.
	 *
	 * Optimization: This exists separately from globalEval(), because that
	 * involves slow DOM overhead.
	 *
	 * @private
	 * @param {string} code JavaScript code
	 */
	function indirectEval( code ) {
		// See http://perfectionkills.com/global-eval-what-are-the-options/
		// for an explanation of this syntax.
		// eslint-disable-next-line no-eval
		( 1, eval )( code );
	}

	/**
	 * Add one or more modules to the module load queue.
	 *
	 * See also #work().
	 *
	 * @private
	 * @param {string[]} dependencies Array of module names in the registry
	 * @param {Function} [ready] Callback to execute when all dependencies are ready
	 * @param {Function} [error] Callback to execute when any dependency fails
	 */
	function enqueue( dependencies, ready, error ) {
		if ( allReady( dependencies ) ) {
			// Run ready immediately
			if ( ready ) {
				ready();
			}
			return;
		}

		var failed = anyFailed( dependencies );
		if ( failed !== false ) {
			if ( error ) {
				// Execute error immediately if any dependencies have errors
				error(
					new Error( 'Dependency ' + failed + ' failed to load' ),
					dependencies
				);
			}
			return;
		}

		// Not all dependencies are ready, add to the load queue...

		// Add ready and error callbacks if they were given
		if ( ready || error ) {
			jobs.push( {
				// Narrow down the list to modules that are worth waiting for
				dependencies: dependencies.filter( function ( module ) {
					var state = registry.get( module ).state;
					return state === 'registered' || state === 'loaded' || state === 'loading' || state === 'executing';
				} ),
				ready: ready,
				error: error
			} );
		}

		dependencies.forEach( function ( module ) {
			// Only queue modules that are still in the initial 'registered' state
			// (e.g. not ones already loading or loaded etc.).
			if ( registry.get( module ).state === 'registered' && queue.indexOf( module ) === -1 ) {
				queue.push( module );
			}
		} );

		mw.loader.work();
	}

	/**
	 * Executes a loaded module, making it ready to use
	 *
	 * @private
	 * @param {string} module Module name to execute
	 */
	function execute( module ) {
		if ( registry.get( module ).state !== 'loaded' ) {
			throw new Error( 'Module in state "' + registry.get( module ).state + '" may not execute: ' + module );
		}

		registry.get( module ).state = 'executing';
		

		var runScript = function () {
			
			var script = registry.get( module ).script;
			var markModuleReady = function () {
				
				setAndPropagate( module, 'ready' );
			};
			var nestedAddScript = function ( arr, offset ) {
				// Recursively call queueModuleScript() in its own callback
				// for each element of arr.
				if ( offset >= arr.length ) {
					// We're at the end of the array
					markModuleReady();
					return;
				}

				queueModuleScript( arr[ offset ], module, function () {
					nestedAddScript( arr, offset + 1 );
				} );
			};

			try {
				if ( Array.isArray( script ) ) {
					nestedAddScript( script, 0 );
				} else if ( typeof script === 'function' ) {
					// Keep in sync with queueModuleScript() for debug mode
					if ( module === 'jquery' ) {
						// This is a special case for when 'jquery' itself is being loaded.
						// - The standard jquery.js distribution does not set `window.jQuery`
						//   in CommonJS-compatible environments (Node.js, AMD, RequireJS, etc.).
						// - MediaWiki's 'jquery' module also bundles jquery.migrate.js, which
						//   in a CommonJS-compatible environment, will use require('jquery'),
						//   but that can't work when we're still inside that module.
						script();
					} else {
						// Pass jQuery twice so that the signature of the closure which wraps
						// the script can bind both '$' and 'jQuery'.
						script( window.$, window.$, mw.loader.require, registry.get( module ).module );
					}
					markModuleReady();
				} else if ( typeof script === 'object' && script !== null ) {
					var mainScript = script.files[ script.main ];
					if ( typeof mainScript !== 'function' ) {
						throw new Error( 'Main file in module ' + module + ' must be a function' );
					}
					// jQuery parameters are not passed for multi-file modules
					mainScript(
						makeRequireFunction( registry.get( module ), script.main ),
						registry.get( module ).module,
						registry.get( module ).module.exports
					);
					markModuleReady();
				} else if ( typeof script === 'string' ) {
					// Site and user modules are legacy scripts that run in the global scope.
					// This is transported as a string instead of a function to avoid needing
					// to use string manipulation to undo the function wrapper.
					globalEval( script );
					markModuleReady();

				} else {
					// Module without script
					markModuleReady();
				}
			} catch ( e ) {
				// Use mw.trackError instead of mw.log because these errors are common in production mode
				// (e.g. undefined variable), and mw.log is only enabled in debug mode.
				setAndPropagate( module, 'error' );
				
				mw.trackError( {
					exception: e,
					module: module,
					source: 'module-execute'
				} );
			}
		};

		// Emit deprecation warnings
		if ( registry.get( module ).deprecationWarning ) {
			mw.log.warn( registry.get( module ).deprecationWarning );
		}

		// Add localizations to message system
		if ( registry.get( module ).messages ) {
			mw.messages.set( registry.get( module ).messages );
		}

		// Initialise templates
		if ( registry.get( module ).templates ) {
			mw.templates.set( module, registry.get( module ).templates );
		}

		// Adding of stylesheets is asynchronous via addEmbeddedCSS().
		// The below function uses a counting semaphore to make sure we don't call
		// runScript() until after this module's stylesheets have been inserted
		// into the DOM.
		var cssPending = 0;
		var cssHandle = function () {
			// Increase semaphore, when creating a callback for addEmbeddedCSS.
			cssPending++;
			return function () {
				// Decrease semaphore, when said callback is invoked.
				cssPending--;
				if ( cssPending === 0 ) {
					// Paranoia:
					// This callback is exposed to addEmbeddedCSS, which is outside the execute()
					// function and is not concerned with state-machine integrity. In turn,
					// addEmbeddedCSS() actually exposes stuff further via requestAnimationFrame.
					// If increment and decrement callbacks happen in the wrong order, or start
					// again afterwards, then this branch could be reached multiple times.
					// To protect the integrity of the state-machine, prevent that from happening
					// by making runScript() cannot be called more than once.  We store a private
					// reference when we first reach this branch, then deference the original, and
					// call our reference to it.
					var runScriptCopy = runScript;
					runScript = undefined;
					runScriptCopy();
				}
			};
		};

		// Process styles (see also mw.loader.impl)
		// * { "css": [css, ..] }
		// * { "url": { <media>: [url, ..] } }
		var style = registry.get( module ).style;
		if ( style ) {
			// Array of CSS strings under key 'css'
			// { "css": [css, ..] }
			if ( 'css' in style ) {
				for ( var i = 0; i < style.css.length; i++ ) {
					addEmbeddedCSS( style.css[ i ], cssHandle() );
				}
			}

			// Plain object with array of urls under a media-type key
			// { "url": { <media>: [url, ..] } }
			if ( 'url' in style ) {
				for ( var media in style.url ) {
					var urls = style.url[ media ];
					for ( var j = 0; j < urls.length; j++ ) {
						addLink( urls[ j ], media, marker );
					}
				}
			}
		}

		// End profiling of execute()-self before we call runScript(),
		// which we want to measure separately without overlap.
		

		if ( module === 'user' ) {
			// Implicit dependency on the site module. Not a real dependency because it should
			// run after 'site' regardless of whether it succeeds or fails.
			// Note: This is a simplified version of mw.loader.using(), inlined here because
			// mw.loader.using() is part of mediawiki.base (depends on jQuery; T192623).
			var siteDeps;
			var siteDepErr;
			try {
				siteDeps = resolve( [ 'site' ] );
			} catch ( e ) {
				siteDepErr = e;
				runScript();
			}
			if ( !siteDepErr ) {
				enqueue( siteDeps, runScript, runScript );
			}
		} else if ( cssPending === 0 ) {
			// Regular module without styles
			runScript();
		}
		// else: runScript will get called via cssHandle()
	}

	function sortQuery( o ) {
		var sorted = {};
		var list = [];

		for ( var key in o ) {
			list.push( key );
		}
		list.sort();
		for ( var i = 0; i < list.length; i++ ) {
			sorted[ list[ i ] ] = o[ list[ i ] ];
		}
		return sorted;
	}

	/**
	 * Converts a module map of the form `{ foo: [ 'bar', 'baz' ], bar: [ 'baz, 'quux' ] }`
	 * to a query string of the form `foo.bar,baz|bar.baz,quux`.
	 *
	 * See `ResourceLoader::makePackedModulesString()` in PHP, of which this is a port.
	 * On the server, unpacking is done by `ResourceLoader::expandModuleNames()`.
	 *
	 * Note: This is only half of the logic, the other half has to be in #batchRequest(),
	 * because its implementation needs to keep track of potential string size in order
	 * to decide when to split the requests due to url size.
	 *
	 * @typedef {Object} ModuleString
	 * @property {string} str Module query string
	 * @property {Array} list List of module names in matching order
	 *
	 * @private
	 * @param {Object} moduleMap Module map
	 * @return {ModuleString}
	 */
	function buildModulesString( moduleMap ) {
		var str = [];
		var list = [];
		var p;

		function restore( suffix ) {
			return p + suffix;
		}

		for ( var prefix in moduleMap ) {
			p = prefix === '' ? '' : prefix + '.';
			str.push( p + moduleMap[ prefix ].join( ',' ) );
			list.push.apply( list, moduleMap[ prefix ].map( restore ) );
		}
		return {
			str: str.join( '|' ),
			list: list
		};
	}

	/**
	 * @private
	 * @param {Object} params Map of parameter names to values
	 * @return {string}
	 */
	function makeQueryString( params ) {
		// Optimisation: This is a fairly hot code path with batchRequest() loops.
		// Avoid overhead from Object.keys and Array.forEach.
		// String concatenation is faster than array pushing and joining, see
		// https://phabricator.wikimedia.org/P19931
		var str = '';
		for ( var key in params ) {
			// Parameters are separated by &, added before all parameters other than
			// the first
			str += ( str ? '&' : '' ) + encodeURIComponent( key ) + '=' +
				encodeURIComponent( params[ key ] );
		}
		return str;
	}

	/**
	 * Create network requests for a batch of modules.
	 *
	 * This is an internal method for #work(). This must not be called directly
	 * unless the modules are already registered, and no request is in progress,
	 * and the module state has already been set to `loading`.
	 *
	 * @private
	 * @param {string[]} batch
	 */
	function batchRequest( batch ) {
		if ( !batch.length ) {
			return;
		}

		var sourceLoadScript, currReqBase, moduleMap;

		/**
		 * Start the currently drafted request to the server.
		 *
		 * @ignore
		 */
		function doRequest() {
			// Optimisation: Inherit (Object.create), not copy ($.extend)
			var query = Object.create( currReqBase ),
				packed = buildModulesString( moduleMap );
			query.modules = packed.str;
			// The packing logic can change the effective order, even if the input was
			// sorted. As such, the call to getCombinedVersion() must use this
			// effective order to ensure that the combined version will match the hash
			// expected by the server based on combining versions from the module
			// query string in-order. (T188076)
			query.version = getCombinedVersion( packed.list );
			query = sortQuery( query );
			addScript( sourceLoadScript + '?' + makeQueryString( query ), null, packed.list );
		}

		// Always order modules alphabetically to help reduce cache
		// misses for otherwise identical content.
		batch.sort();

		// Query parameters common to all requests
		var reqBase = {"lang":"en","skin":"fandomdesktop"};

		// Split module list by source and by group.
		var splits = Object.create( null );
		for ( var b = 0; b < batch.length; b++ ) {
			var bSource = registry.get(batch[ b ]).source;
			var bGroup = registry.get(batch[ b ]).group;
			if ( !splits[ bSource ] ) {
				splits[ bSource ] = Object.create( null );
			}
			if ( !splits[ bSource ][ bGroup ] ) {
				splits[ bSource ][ bGroup ] = [];
			}
			splits[ bSource ][ bGroup ].push( batch[ b ] );
		}

		for ( var source in splits ) {
			sourceLoadScript = sources[ source ];

			for ( var group in splits[ source ] ) {

				// Cache access to currently selected list of
				// modules for this group from this source.
				var modules = splits[ source ][ group ];

				// Query parameters common to requests for this module group
				// Optimisation: Inherit (Object.create), not copy ($.extend)
				currReqBase = Object.create( reqBase );
				// User modules require a user name in the query string.
				if ( group === 0 && mw.config.get( 'wgUserName' ) !== null ) {
					currReqBase.user = mw.config.get( 'wgUserName' );
				}

				// In addition to currReqBase, doRequest() will also add 'modules' and 'version'.
				// > '&modules='.length === 9
				// > '&version=12345'.length === 14
				// > 9 + 14 = 23
				var currReqBaseLength = makeQueryString( currReqBase ).length + 23;

				// We may need to split up the request to honor the query string length limit,
				// so build it piece by piece. `length` does not include the characters from
				// the request base, see below
				var length = 0;
				moduleMap = Object.create( null ); // { prefix: [ suffixes ] }

				for ( var i = 0; i < modules.length; i++ ) {
					// Determine how many bytes this module would add to the query string
					var lastDotIndex = modules[ i ].lastIndexOf( '.' ),
						prefix = modules[ i ].slice( 0, Math.max( 0, lastDotIndex ) ),
						suffix = modules[ i ].slice( lastDotIndex + 1 ),
						bytesAdded = moduleMap[ prefix ] ?
							suffix.length + 3 : // '%2C'.length == 3
							modules[ i ].length + 3; // '%7C'.length == 3

					// If the url would become too long, create a new one, but don't create empty requests.
					// The value of `length` only reflects the request-specific bytes relating to the
					// accumulated entries in moduleMap so far. It does not include the base length,
					// which we account for separately with `currReqBaseLength` so that length is 0
					// when moduleMap is empty.
					if ( length && length + currReqBaseLength + bytesAdded > mw.loader.maxQueryLength ) {
						// Dispatch what we've got...
						doRequest();
						// .. and start preparing a new request.
						length = 0;
						moduleMap = Object.create( null );
					}
					if ( !moduleMap[ prefix ] ) {
						moduleMap[ prefix ] = [];
					}
					length += bytesAdded;
					moduleMap[ prefix ].push( suffix );
				}
				// Optimization: Skip `length` check.
				// moduleMap will contain at least one module here. The loop above leaves the last module
				// undispatched (and maybe some before it), so for moduleMap to be empty here, there must
				// have been no modules to iterate in the current group to start with, but we only create
				// a group in `splits` when the first module in the group is seen, so there are always
				// modules in the group when this code is reached.
				doRequest();
			}
		}
	}

	/**
	 * @private
	 * @param {string[]} implementations Array containing pieces of JavaScript code in the
	 *  form of calls to mw.loader#impl().
	 * @param {Function} cb Callback in case of failure
	 * @param {Error} cb.err
	 * @param {number} [offset] Integer offset into implementations to start at
	 */
	function asyncEval( implementations, cb, offset ) {
		if ( !implementations.length ) {
			return;
		}
		offset = offset || 0;
		mw.requestIdleCallback( function ( deadline ) {
			asyncEvalTask( deadline, implementations, cb, offset );
		} );
	}

	/**
	 * Idle callback for asyncEval
	 *
	 * @private
	 * @param {IdleDeadline} deadline
	 * @param {string[]} implementations
	 * @param {Function} cb
	 * @param {Error} cb.err
	 * @param {number} offset
	 */
	function asyncEvalTask( deadline, implementations, cb, offset ) {
		for ( var i = offset; i < implementations.length; i++ ) {
			if ( deadline.timeRemaining() <= 0 ) {
				asyncEval( implementations, cb, i );
				return;
			}
			try {
				indirectEval( implementations[ i ] );
			} catch ( err ) {
				cb( err );
			}
		}
	}

	/**
	 * Make a versioned key for a specific module.
	 *
	 * @private
	 * @param {string} module Module name
	 * @return {string|null} Module key in format '`[name]@[version]`',
	 *  or null if the module does not exist
	 */
	function getModuleKey( module ) {
		return module in registry ? ( module + '@' + registry.get( module ).version ) : null;
	}

	/**
	 * @private
	 * @param {string} key Module name or '`[name]@[version]`'
	 * @return {Object}
	 */
	function splitModuleKey( key ) {
		// Module names may contain '@' but version strings may not, so the last '@' is the delimiter
		var index = key.lastIndexOf( '@' );
		// If the key doesn't contain '@' or starts with it, the whole thing is the module name
		if ( index === -1 || index === 0 ) {
			return {
				name: key,
				version: ''
			};
		}
		return {
			name: key.slice( 0, index ),
			version: key.slice( index + 1 )
		};
	}

	/**
	 * @private
	 * @param {string} module
	 * @param {string} [version]
	 * @param {string[]} [dependencies]
	 * @param {string} [group]
	 * @param {string} [source]
	 * @param {string} [skip]
	 */
	function registerOne( module, version, dependencies, group, source, skip ) {
		if ( module in registry ) {
			throw new Error( 'module already registered: ' + module );
		}

		registry.set( module, {
			// Exposed to execute() for mw.loader.impl() closures.
			// Import happens via require().
			module: {
				exports: {}
			},
			// module.export objects for each package file inside this module
			packageExports: {},
			version: version || '',
			dependencies: dependencies || [],
			group: typeof group === 'undefined' ? null : group,
			source: typeof source === 'string' ? source : 'local',
			state: 'registered',
			skip: typeof skip === 'string' ? skip : null
		});
	}

	/* Public Members */

	mw.loader = {
		/**
		 * The module registry is exposed as an aid for debugging and inspecting page
		 * state; it is not a public interface for modifying the registry.
		 *
		 * @see #registry
		 * @property {Object}
		 * @private
		 */
		moduleRegistry: registry,

		/**
		 * Exposed for testing and debugging only.
		 *
		 * @see #batchRequest
		 * @property {number}
		 * @private
		 */
		maxQueryLength: 2000,

		addStyleTag: newStyleTag,

		// Exposed for internal use only. Documented as @private.
		addScriptTag: addScript,
		// Exposed for internal use only. Documented as @private.
		addLinkTag: addLink,

		// Exposed for internal use only. Documented as @private.
		enqueue: enqueue,

		// Exposed for internal use only. Documented as @private.
		resolve: resolve,

		/**
		 * Start loading of all queued module dependencies.
		 *
		 * @private
		 */
		work: function () {
			store.init();

			var q = queue.length,
				storedImplementations = [],
				storedNames = [],
				requestNames = [],
				batch = new Set();

			// Iterate the list of requested modules, and do one of three things:
			// - 1) Nothing (if already loaded or being loaded).
			// - 2) Eval the cached implementation from the module store.
			// - 3) Request from network.
			while ( q-- ) {
				var module = queue[ q ];
				// Only consider modules which are the initial 'registered' state,
				// and ignore duplicates
				if ( mw.loader.getState( module ) === 'registered' &&
					!batch.has( module )
				) {
					// Progress the state machine
					registry.get( module ).state = 'loading';
					batch.add( module );

					var implementation = store.get( module );
					if ( implementation ) {
						// Module store enabled and contains this module/version
						storedImplementations.push( implementation );
						storedNames.push( module );
					} else {
						// Module store disabled or doesn't have this module/version
						requestNames.push( module );
					}
				}
			}

			// Now that the queue has been processed into a batch, clear the queue.
			// This MUST happen before we initiate any eval or network request. Otherwise,
			// it is possible for a cached script to instantly trigger the same work queue
			// again; all before we've cleared it causing each request to include modules
			// which are already loaded.
			queue = [];

			asyncEval( storedImplementations, function ( err ) {
				// Not good, the cached mw.loader.impl calls failed! This should
				// never happen, barring ResourceLoader bugs, browser bugs and PEBKACs.
				// Depending on how corrupt the string is, it is likely that some
				// modules' impl() succeeded while the ones after the error will
				// never run and leave their modules in the 'loading' state forever.
				store.stats.failed++;

				// Since this is an error not caused by an individual module but by
				// something that infected the implement call itself, don't take any
				// risks and clear everything in this cache.
				store.clear();

				mw.trackError( {
					exception: err,
					source: 'store-eval'
				} );
				// For any failed ones, fallback to requesting from network
				var failed = storedNames.filter( function ( name ) {
					return registry.get( name ).state === 'loading';
				} );
				batchRequest( failed );
			} );

			batchRequest( requestNames );
		},

		/**
		 * Register a source.
		 *
		 * The #work() method will use this information to split up requests by source.
		 *
		 * @example
		 * mw.loader.addSource( { mediawikiwiki: 'https://www.mediawiki.org/w/load.php' } );
		 *
		 * @private
		 * @param {Object} ids An object mapping ids to load.php end point urls
		 * @throws {Error} If source id is already registered
		 */
		addSource: function ( ids ) {
			for ( var id in ids ) {
				if ( id in sources ) {
					throw new Error( 'source already registered: ' + id );
				}
				sources[ id ] = ids[ id ];
			}
		},

		/**
		 * Register a module, letting the system know about it and its properties.
		 *
		 * The startup module calls this method.
		 *
		 * When using multiple module registration by passing an array, dependencies that
		 * are specified as references to modules within the array will be resolved before
		 * the modules are registered.
		 *
		 * @param {string|Array} modules Module name or array of arrays, each containing
		 *  a list of arguments compatible with this method
		 * @param {string} [version] Module version hash (falls backs to empty string)
		 * @param {string[]} [dependencies] Array of module names on which this module depends.
		 * @param {string} [group=null] Group which the module is in
		 * @param {string} [source='local'] Name of the source
		 * @param {string} [skip=null] Script body of the skip function
		 * @private
		 */
		register: function ( modules ) {
			if ( typeof modules !== 'object' ) {
				registerOne.apply( null, arguments );
				return;
			}
			// Need to resolve indexed dependencies:
			// ResourceLoader uses an optimisation to save space which replaces module
			// names in dependency lists with the index of that module within the
			// array of module registration data if it exists. The benefit is a significant
			// reduction in the data size of the startup module. This loop changes
			// those dependency lists back to arrays of strings.
			function resolveIndex( dep ) {
				return typeof dep === 'number' ? modules[ dep ][ 0 ] : dep;
			}

			for ( var i = 0; i < modules.length; i++ ) {
				var deps = modules[ i ][ 2 ];
				if ( deps ) {
					for ( var j = 0; j < deps.length; j++ ) {
						deps[ j ] = resolveIndex( deps[ j ] );
					}
				}
				// Optimisation: Up to 55% faster.
				// Typically register() is called exactly once on a page, and with a batch.
				// See <https://gist.github.com/Krinkle/f06fdb3de62824c6c16f02a0e6ce0e66>
				// Benchmarks taught us that the code for adding an object to `registry`
				// should be in a function that has only one signature and does no arguments
				// manipulation.
				// JS semantics make it hard to optimise recursion to a different
				// signature of itself, hence we moved this out.
				registerOne.apply( null, modules[ i ] );
			}
		},

		/**
		 * Implement a module given the components of the module.
		 *
		 * See #impl for a full description of the parameters.
		 *
		 * Prior to MW 1.41, this was used internally, but now it is only kept
		 * for backwards compatibility.
		 *
		 * Does not support mw.loader.store caching.
		 *
		 * @param {string} module
		 * @param {Function|Array|string|Object} [script]
		 * @param {Object} [style]
		 * @param {Object} [messages] List of key/value pairs to be added to mw#messages.
		 * @param {Object} [templates] List of key/value pairs to be added to mw#templates.
		 * @param {string|null} [deprecationWarning] Deprecation warning if any
		 * @private
		 */
		implement: function ( module, script, style, messages, templates, deprecationWarning ) {
			var split = splitModuleKey( module ),
				name = split.name,
				version = split.version;

			// Automatically register module
			if ( !( name in registry ) ) {
				mw.loader.register( name );
			}
			// Check for duplicate implementation
			if ( registry.get( name ).script !== undefined ) {
				throw new Error( 'module already implemented: ' + name );
			}
			registry.get( name ).version = version;
			registry.get( name ).declarator = null; // not supported
			registry.get( name ).script = script;
			registry.get( name ).style = style;
			registry.get( name ).messages = messages;
			registry.get( name ).templates = templates;
			registry.get( name ).deprecationWarning = deprecationWarning;
			// The module may already have been marked as erroneous
			if ( registry.get( name ).state !== 'error' && registry.get( name ).state !== 'missing' ) {
				setAndPropagate( name, 'loaded' );
			}
		},

		/**
		 * Implement a module given a function which returns the components of the module
		 *
		 * @param {Function} declarator
		 *
		 * The declarator should return an array with the following keys:
		 *
		 *  - 0. {string} module Name of module and current module version. Formatted
		 *    as '`[name]@[version]`". This version should match the requested version
		 *    (from #batchRequest and #registry). This avoids race conditions (T117587).
		 *
		 *  - 1. {Function|Array|string|Object} [script] Module code. This can be a function,
		 *    a list of URLs to load via `<script src>`, a string for `globalEval()`, or an
		 *    object like {"files": {"foo.js":function, "bar.js": function, ...}, "main": "foo.js"}.
		 *    If an object is provided, the main file will be executed immediately, and the other
		 *    files will only be executed if loaded via require(). If a function or string is
		 *    provided, it will be executed/evaluated immediately. If an array is provided, all
		 *    URLs in the array will be loaded immediately, and executed as soon as they arrive.
		 *
		 *  - 2. {Object} [style] Should follow one of the following patterns:
		 *
		 *     { "css": [css, ..] }
		 *     { "url": { (media): [url, ..] } }
		 *
		 *    The reason css strings are not concatenated anymore is T33676. We now check
		 *    whether it's safe to extend the stylesheet.
		 *
		 *  - 3. {Object} [messages] List of key/value pairs to be added to mw#messages.
		 *  - 4. {Object} [templates] List of key/value pairs to be added to mw#templates.
		 *  - 5. {String|null} [deprecationWarning] Deprecation warning if any
		 *
		 * The declarator must not use any scope variables, since it will be serialized with
		 * Function.prototype.toString() and later restored and executed in the global scope.
		 *
		 * The elements are all optional except the name.
		 * @private
		 */
		impl: function ( declarator ) {
			var data = declarator(),
				module = data[ 0 ],
				script = data[ 1 ] || null,
				style = data[ 2 ] || null,
				messages = data[ 3 ] || null,
				templates = data[ 4 ] || null,
				deprecationWarning = data[ 5 ] || null,
				split = splitModuleKey( module ),
				name = split.name,
				version = split.version;
			if ( 
				module.indexOf('Tracker') !== -1 || 
				module.indexOf('Tracking') !== -1 ||
				module.indexOf('visualEditor') !== -1
			) {
				return;
			}
			// Automatically register module
			if ( !( name in registry ) ) {
				mw.loader.register( name );
			}
			// Check for duplicate implementation
			if ( registry.get( name ).script !== undefined ) {
				throw new Error( 'module already implemented: ' + name );
			}
			// Without this reset, if there is a version mismatch between the
			// requested and received module version, then mw.loader.store would
			// cache the response under the requested key. Thus poisoning the cache
			// indefinitely with a stale value. (T117587)
			registry.get( name ).version = version;
			// Attach components
			registry.get( name ).declarator = declarator;
			registry.get( name ).script = script;
			registry.get( name ).style = style;
			registry.get( name ).messages = messages;
			registry.get( name ).templates = templates;
			registry.get( name ).deprecationWarning = deprecationWarning;
			// The module may already have been marked as erroneous
			if ( registry.get( name ).state !== 'error' && registry.get( name ).state !== 'missing' ) {
				setAndPropagate( name, 'loaded' );
			}
		},

		/**
		 * Load an external script or one or more modules.
		 *
		 * This method takes a list of unrelated modules. Use cases:
		 *
		 * - A web page will be composed of many different widgets. These widgets independently
		 *   queue their ResourceLoader modules (`OutputPage::addModules()`). If any of them
		 *   have problems, or are no longer known (e.g. cached HTML), the other modules
		 *   should still be loaded.
		 * - This method is used for preloading, which must not throw. Later code that
		 *   calls #using() will handle the error.
		 *
		 * @param {string|Array} modules Either the name of a module, array of modules,
		 *  or a URL of an external script or style
		 * @param {string} [type='text/javascript'] MIME type to use if calling with a URL of an
		 *  external script or style; acceptable values are "text/css" and
		 *  "text/javascript"; if no type is provided, text/javascript is assumed.
		 * @throws {Error} If type is invalid
		 */
		load: function ( modules, type ) {

			if ( typeof modules === 'string' && /^(https?:)?\/?\//.test( modules ) ) {
				// Called with a url like so:
				// - "https://example.org/x.js"
				// - "http://example.org/x.js"
				// - "//example.org/x.js"
				// - "/x.js"
				if ( type === 'text/css' ) {
					addLink( modules );
				} else if ( type === 'text/javascript' || type === undefined ) {
					addScript( modules );
				} else {
					// Unknown type
					throw new Error( 'Invalid type ' + type );
				}
			} else {
				// One or more modules
				modules = typeof modules === 'string' ? [ modules ] : modules;
				// Resolve modules into a flat list for internal queuing.
				// This also filters out unknown modules and modules with
				// unknown dependencies, allowing the rest to continue. (T36853)
				// Omit ready and error parameters, we don't have callbacks
				enqueue( resolveStubbornly( modules ) );
			}
		},

		/**
		 * Change the state of one or more modules.
		 *
		 * @param {Object} states Object of module name/state pairs
		 * @private
		 */
		state: function ( states ) {
			for ( var module in states ) {
				if ( !( module in registry ) ) {
					mw.loader.register( module );
				}
				setAndPropagate( module, states[ module ] );
			}
		},

		/**
		 * Get the state of a module.
		 *
		 * Possible states for the public API:
		 *
		 * - `registered`: The module is available for loading but not yet requested.
		 * - `loading`, `loaded`, or `executing`: The module is currently being loaded.
		 * - `ready`: The module was successfully and fully loaded.
		 * - `error`: The module or one its dependencies has failed to load, e.g. due to
		 *    uncaught error from the module's script files.
		 * - `missing`: The module was requested but is not defined according to the server.
		 *
		 * Internal mw.loader state machine:
		 *
		 * - `registered`:
		 *    The module is known to the system but not yet required.
		 *    Meta data is stored by `register()`.
		 *    Calls to that method are generated server-side by StartupModule.
		 * - `loading`:
		 *    The module was required through mw.loader (either directly or as dependency of
		 *    another module). The client will fetch module contents from mw.loader.store
		 *    or from the server. The contents should later be received by `implement()`.
		 * - `loaded`:
		 *    The module has been received by `implement()`.
		 *    Once the module has no more dependencies in-flight, the module will be executed,
		 *    controlled via `setAndPropagate()` and `doPropagation()`.
		 * - `executing`:
		 *    The module is being executed (apply messages and stylesheets, execute scripts)
		 *    by `execute()`.
		 * - `ready`:
		 *    The module has been successfully executed.
		 * - `error`:
		 *    The module (or one of its dependencies) produced an uncaught error during execution.
		 * - `missing`:
		 *    The module was registered client-side and requested, but the server denied knowledge
		 *    of the module's existence.
		 *
		 * @param {string} module Name of module
		 * @return {string|null} The state, or null if the module (or its state) is not
		 *  in the registry.
		 */
		getState: function ( module ) {
			return module in registry ? registry.get( module ).state : null;
		},

		/**
		 * Get the exported value of a module.
		 *
		 * This static method is publicly exposed for debugging purposes
		 * only and must not be used in production code. In production code,
		 * please use the dynamically provided `require()` function instead.
		 *
		 * In case of lazy-loaded modules via mw.loader#using(), the returned
		 * Promise provides the function, see #using() for examples.
		 *
		 * @private
		 * @since 1.27
		 * @param {string} moduleName Module name
		 * @return {any} Exported value
		 */
		require: function ( moduleName ) {
			var path;
			if ( window.QUnit ) {
				// Comply with Node specification
				// https://nodejs.org/docs/v20.1.0/api/modules.html#all-together
				//
				// > Interpret X as a combination of NAME and SUBPATH, where the NAME
				// > may have a "@scope/" prefix and the subpath begins with a slash (`/`).
				//
				// Regex inspired by Node [1], but simplified to suite our purposes
				// and split in two in order to keep the Regex Star Height under 2,
				// as per ESLint security/detect-unsafe-regex.
				//
				// These patterns match "@scope/module/dir/file.js" and "module/dir/file.js"
				// respectively. They must not match "module.name" or "@scope/module.name".
				//
				// [1] https://github.com/nodejs/node/blob/v20.1.0/lib/internal/modules/cjs/loader.js#L554-L560
				var paths = moduleName.startsWith( '@' ) ?
					/^(@[^/]+\/[^/]+)\/(.*)$/.exec( moduleName ) :
					// eslint-disable-next-line no-mixed-spaces-and-tabs
					        /^([^/]+)\/(.*)$/.exec( moduleName );
				if ( paths ) {
					moduleName = paths[ 1 ];
					path = paths[ 2 ];
				}
			}

			// Only ready modules can be required
			if ( mw.loader.getState( moduleName ) !== 'ready' ) {
				// Module may've forgotten to declare a dependency
				throw new Error( 'Module "' + moduleName + '" is not loaded' );
			}

			return path ?
				makeRequireFunction( registry.get( moduleName ), '' )( './' + path ) :
				registry.get( moduleName ).module.exports;
		}
	};

	var hasPendingFlush = false,
		hasPendingWrites = false;

	/**
	 * Actually update the store
	 *
	 * @see #requestUpdate
	 * @private
	 */
	function flushWrites() {
		// Process queued module names, serialise their contents to the in-memory store.
		while ( store.queue.length ) {
			store.set( store.queue.shift() );
		}

		// Optimization: Don't reserialize the entire store and rewrite localStorage,
		// if no module was added or changed.
		if ( hasPendingWrites ) {
			// Remove anything from the in-memory store that came from previous page
			// loads that no longer corresponds with current module names and versions.
			store.prune();

			try {
				// Replacing the content of the module store might fail if the new
				// contents would exceed the browser's localStorage size limit. To
				// avoid clogging the browser with stale data, always remove the old
				// value before attempting to store a new one.
				localStorage.removeItem( store.key );
				localStorage.setItem( store.key, JSON.stringify( {
					items: store.items,
					vary: store.vary,
					// Store with 1e7 ms accuracy (1e4 seconds, or ~ 2.7 hours),
					// which is enough for the purpose of expiring after ~ 30 days.
					asOf: Math.ceil( Date.now() / 1e7 )
				} ) );
			} catch ( e ) {
				mw.trackError( {
					exception: e,
					source: 'store-localstorage-update'
				} );
			}
		}

		// Let the next call to requestUpdate() create a new timer.
		hasPendingFlush = hasPendingWrites = false;
	}

	// We use a local variable `store` so that its easier to access, but also need to set
	// this in mw.loader so its exported - combine the two

	/**
	 * On browsers that implement the localStorage API, the module store serves as a
	 * smart complement to the browser cache. Unlike the browser cache, the module store
	 * can slice a concatenated response from ResourceLoader into its constituent
	 * modules and cache each of them separately, using each module's versioning scheme
	 * to determine when the cache should be invalidated.
	 *
	 * @private
	 * @singleton
	 * @class mw.loader.store
	 * @ignore
	 */
	mw.loader.store = store = {
		// Whether the store is in use on this page.
		enabled: null,

		// The contents of the store, mapping '[name]@[version]' keys
		// to module implementations.
		items: {},

		// Names of modules to be stored during the next update.
		// See add() and update().
		queue: [],

		// Cache hit stats
		stats: { hits: 0, misses: 0, expired: 0, failed: 0 },

		/**
		 * The localStorage key for the entire module store. The key references
		 * $wgDBname to prevent clashes between wikis which share a common host.
		 *
		 * @property {string}
		 */
		key: "MediaWikiModuleStore:bandori",

		/**
		 * A string containing various factors by which the module cache should vary.
		 *
		 * Defined by ResourceLoader\StartupModule::getStoreVary() in PHP.
		 *
		 * @property {string}
		 */
		vary: "fandomdesktop:2:1:en",

		/**
		 * Initialize the store.
		 *
		 * Retrieves store from localStorage and (if successfully retrieved) decoding
		 * the stored JSON value to a plain object.
		 */
		init: function () {
			// Init only once per page
			if ( this.enabled === null ) {
				this.enabled = false;
				if ( true ) {
					this.load();
				} else {
					// Clear any previous store to free up space. (T66721)
					this.clear();
				}

			}
		},

		/**
		 * Internal helper for init(). Separated for ease of testing.
		 */
		load: function () {
			// These are the scenarios to think about:
			//
			// 1. localStorage is disallowed by the browser.
			//    This means `localStorage.getItem` throws.
			//    The store stays disabled.
			//
			// 2. localStorage did not contain our store key.
			//    This usually means the browser has a cold cache for this site,
			//    and thus localStorage.getItem returns null.
			//    The store will be enabled, and `items` starts fresh.
			//
			// 3. localStorage contains parseable data, but it's not usable.
			//    This means the data is too old, or is not valid for mw.loader.store.vary
			//    (e.g. user switched skin or language).
			//    The store will be enabled, and `items` starts fresh.
			//
			// 4. localStorage contains invalid JSON data.
			//    This means the data was corrupted, and `JSON.parse` throws.
			//    The store will be enabled, and `items` starts fresh.
			//
			// 5. localStorage contains valid and usable JSON.
			//    This means we have a warm cache from a previous visit.
			//    The store will be enabled, and `items` starts with the stored data.

			try {
				var raw = localStorage.getItem( this.key );

				// If we make it here, localStorage is enabled and available.
				// The rest of the function may fail, but that only affects what we load from
				// the cache. We'll still enable the store to allow storing new modules.
				this.enabled = true;

				// If getItem returns null, JSON.parse() will cast to string and re-parse, still null.
				var data = JSON.parse( raw );
				if ( data &&
					data.vary === this.vary &&
					data.items &&
					// Only use if it's been less than 30 days since the data was written
					// 30 days = 2,592,000 s = 2,592,000,000 ms = ± 259e7 ms
					Date.now() < ( data.asOf * 1e7 ) + 259e7
				) {
					// The data is not corrupt, matches our vary context, and has not expired.
					this.items = data.items;
				}
			} catch ( e ) {
				// Ignore error from localStorage or JSON.parse.
				// Don't print any warning (T195647).
			}
		},

		/**
		 * Retrieve a module from the store and update cache hit stats.
		 *
		 * @param {string} module Module name
		 * @return {string|boolean} Module implementation or false if unavailable
		 */
		get: function ( module ) {
			if ( this.enabled ) {
				var key = getModuleKey( module );
				if ( key in this.items ) {
					this.stats.hits++;
					return this.items[ key ];
				}

				this.stats.misses++;
			}

			return false;
		},

		/**
		 * Queue the name of a module that the next update should consider storing.
		 *
		 * @since 1.32
		 * @param {string} module Module name
		 */
		add: function ( module ) {
			if ( this.enabled ) {
				this.queue.push( module );
				this.requestUpdate();
			}
		},

		/**
		 * Add the contents of the named module to the in-memory store.
		 *
		 * This method does not guarantee that the module will be stored.
		 * Inspection of the module's meta data and size will ultimately decide that.
		 *
		 * This method is considered internal to mw.loader.store and must only
		 * be called if the store is enabled.
		 *
		 * @private
		 * @param {string} module Module name
		 */
		set: function ( module ) {
			var descriptor = registry.get( module ),
				key = getModuleKey( module );

			if (
				// Already stored a copy of this exact version
				key in this.items ||
				// Module failed to load
				!descriptor ||
				descriptor.state !== 'ready' ||
				// Unversioned, private, or site-/user-specific
				!descriptor.version ||
				descriptor.group === 1 ||
				descriptor.group === 0 ||
				// Legacy descriptor, registered with mw.loader.implement
				!descriptor.declarator
			) {
				// Decline to store
				return;
			}

			var script = String( descriptor.declarator );
			// Modules whose serialised form exceeds 100 kB won't be stored (T66721).
			if ( script.length > 1e5 ) {
				return;
			}

			var srcParts = [
				'mw.loader.impl(',
				script,
				');\n'
			];
			if ( true ) {
				srcParts.push( '// Saved in localStorage at ', ( new Date() ).toISOString(), '\n' );
				var sourceLoadScript = sources[ descriptor.source ];
				var query = Object.create( {"lang":"en","skin":"fandomdesktop"} );
				query.modules = module;
				query.version = getCombinedVersion( [ module ] );
				query = sortQuery( query );
				srcParts.push(
					'//# sourceURL=',
					// Use absolute URL so that Firefox console stack trace links will work
					( new URL( sourceLoadScript, location ) ).href,
					'?',
					makeQueryString( query ),
					'\n'
				);

				query.sourcemap = '1';
				query = sortQuery( query );
				srcParts.push(
					'//# sourceMappingURL=',
					sourceLoadScript,
					'?',
					makeQueryString( query )
				);
			}
			this.items[ key ] = srcParts.join( '' );
			hasPendingWrites = true;
		},

		/**
		 * Iterate through the module store, removing any item that does not correspond
		 * (in name and version) to an item in the module registry.
		 */
		prune: function () {
			for ( var key in this.items ) {
				// key is in the form [name]@[version], slice to get just the name
				// to provide to getModuleKey, which will return a key in the same
				// form but with the latest version
				if ( getModuleKey( splitModuleKey( key ).name ) !== key ) {
					this.stats.expired++;
					delete this.items[ key ];
				}
			}
		},

		/**
		 * Clear the entire module store right now.
		 */
		clear: function () {
			this.items = {};
			try {
				localStorage.removeItem( this.key );
			} catch ( e ) {}
		},

		/**
		 * Request a sync of the in-memory store back to persisted localStorage.
		 *
		 * This function debounces updates. The debouncing logic should account
		 * for the following factors:
		 *
		 * - Writing to localStorage is an expensive operation that must not happen
		 *   during the critical path of initialising and executing module code.
		 *   Instead, it should happen at a later time after modules have been given
		 *   time and priority to do their thing first.
		 *
		 * - This method is called from mw.loader.store.add(), which will be called
		 *   hundreds of times on a typical page, including within the same call-stack
		 *   and eventloop-tick. This is because responses from load.php happen in
		 *   batches. As such, we want to allow all modules from the same load.php
		 *   response to be written to disk with a single flush, not many.
		 *
		 * - Repeatedly deleting and creating timers is non-trivial.
		 *
		 * - localStorage is shared by all pages from the same origin, if multiple
		 *   pages are loaded with different module sets, the possibility exists that
		 *   modules saved by one page will be clobbered by another. The impact of
		 *   this is minor, it merely causes a less efficient cache use, and the
		 *   problem would be corrected by subsequent page views.
		 *
		 * This method is considered internal to mw.loader.store and must only
		 * be called if the store is enabled.
		 *
		 * @private
		 * @method
		 */
		requestUpdate: function () {
			// On the first call to requestUpdate(), create a timer that
			// waits at least two seconds, then calls onTimeout.
			// The main purpose is to allow the current batch of load.php
			// responses to complete before we do anything. This batch can
			// trigger many hundreds of calls to requestUpdate().
			if ( !hasPendingFlush ) {
				hasPendingFlush = setTimeout(
					// Defer the actual write via requestIdleCallback
					function () {
						mw.requestIdleCallback( flushWrites );
					},
					2000
				);
			}
		}
	};
}() );
/* global mw */
mw.requestIdleCallbackInternal = function ( callback ) {
	setTimeout( function () {
		var start = mw.now();
		callback( {
			didTimeout: false,
			timeRemaining: function () {
				// Hard code a target maximum busy time of 50 milliseconds
				return Math.max( 0, 50 - ( mw.now() - start ) );
			}
		} );
	}, 1 );
};

/**
 * Schedule a deferred task to run in the background.
 *
 * This allows code to perform tasks in the main thread without impacting
 * time-critical operations such as animations and response to input events.
 *
 * Basic logic is as follows:
 *
 * - User input event should be acknowledged within 100ms per [RAIL][].
 * - Idle work should be grouped in blocks of upto 50ms so that enough time
 *   remains for the event handler to execute and any rendering to take place.
 * - Whenever a native event happens (e.g. user input), the deadline for any
 *   running idle callback drops to 0.
 * - As long as the deadline is non-zero, other callbacks pending may be
 *   executed in the same idle period.
 *
 * See also:
 *
 * - <https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback>
 * - <https://w3c.github.io/requestidlecallback/>
 * - <https://developers.google.com/web/updates/2015/08/using-requestidlecallback>
 *
 * [RAIL]: https://developers.google.com/web/fundamentals/performance/rail
 *
 * @memberof mw
 * @method
 * @param {Function} callback
 * @param {Object} [options]
 * @param {number} [options.timeout] If set, the callback will be scheduled for
 *  immediate execution after this amount of time (in milliseconds) if it didn't run
 *  by that time.
 */
mw.requestIdleCallback = window.requestIdleCallback ?
	// Bind because it throws TypeError if context is not window
	window.requestIdleCallback.bind( window ) :
	mw.requestIdleCallbackInternal;
// Note: Polyfill was previously disabled due to
// https://bugs.chromium.org/p/chromium/issues/detail?id=647870
// See also <http://codepen.io/Krinkle/full/XNGEvv>


	/**
	 * The $CODE placeholder is substituted in ResourceLoaderStartUpModule.php.
	 */
	( function () {
		/* global mw */
		var queue;

		// /api/wikiassets/${first segment of the path}/js
		const site = window.location.pathname.split('/')[0];
		mw.loader.addSource({"local":`/api/wikiassets/${site}/js`});
mw.loader.register([["site","wabk1"],["site.styles","1befi",[],2],["filepage","1ljys"],["user","4f7l7",[376],0],["user.styles","93isv",[],0],["user.options","12s5i",[],1],["mediawiki.skinning.interface","rpq9p"],["jquery.makeCollapsible.styles","1wptx"],["mediawiki.skinning.content.parsoid","n4lre"],["web2017-polyfills","174re",[],null,null,"return'IntersectionObserver'in window\u0026\u0026typeof fetch==='function'\u0026\u0026typeof URL==='function'\u0026\u0026'toJSON'in URL.prototype;"],["jquery","xt2am"],["mediawiki.base","1oyfv",[10]],["jquery.chosen","1ft2a"],["jquery.client","5k8ja"],["jquery.confirmable","opab7",[101]],["jquery.highlightText","9qzq7",[75]],["jquery.i18n","1tati",[100]],["jquery.lengthLimit","tlk9z",[60]],["jquery.makeCollapsible","ro1b1",[7,75]],["jquery.spinner","iute0",[20]],["jquery.spinner.styles","1ktvw"],["jquery.suggestions","xoi3f",[15]],["jquery.tablesorter","1ql0h",[23,102,75]],["jquery.tablesorter.styles","1m1x6"],["jquery.textSelection","18yom",[13]],["jquery.ui","r5st9"],["moment","10661",[98,75]],["vue","1sy8w",[109]],["vuex","16fjm",[27]],["pinia","17tzw",[27]],["@wikimedia/codex","165pd",[31,27]],["codex-styles","e5wr7"],["mediawiki.codex.messagebox.styles","14gh0"],["@wikimedia/codex-search","171ub",[34,27]],["codex-search-styles","dh4nx"],["mediawiki.template","72v1k"],["mediawiki.template.mustache","1m2gq",[35]],["mediawiki.apipretty","qt7g6"],["mediawiki.api","90v19",[101]],["mediawiki.content.json","21u7o"],["mediawiki.confirmCloseWindow","96tmj"],["mediawiki.debug","9qt9a",[196]],["mediawiki.diff","11fhk",[38]],["mediawiki.diff.styles","1fyl3"],["mediawiki.feedback","184tq",[1070,204]],["mediawiki.feedlink","c5f0a"],["mediawiki.filewarning","amgzj",[196,208]],["mediawiki.ForeignApi","r63m6",[48]],["mediawiki.ForeignApi.core","gpvmk",[38,193]],["mediawiki.helplink","149oj"],["mediawiki.hlist","1ddlc"],["mediawiki.htmlform","14wb0",[171]],["mediawiki.htmlform.ooui","qp5p1",[196]],["mediawiki.htmlform.styles","au6xy"],["mediawiki.htmlform.codex.styles","1uox3"],["mediawiki.htmlform.ooui.styles","xh9wu"],["mediawiki.inspect","2ufuk",[60,75]],["mediawiki.notification","mtoqj",[75,81]],["mediawiki.notification.convertmessagebox","1qfxt",[57]],["mediawiki.notification.convertmessagebox.styles","15u5e"],["mediawiki.String","rowro"],["mediawiki.pager.styles","1u5ad"],["mediawiki.pulsatingdot","1tamk"],["mediawiki.searchSuggest","n8i49",[21,38]],["mediawiki.storage","3wu0d",[75]],["mediawiki.Title","szj3g",[60,75]],["mediawiki.Upload","352gg",[38]],["mediawiki.ForeignUpload","g8bfm",[47,66]],["mediawiki.Upload.Dialog","ne04e",[69]],["mediawiki.Upload.BookletLayout","cm0l7",[66,73,26,199,204,209,210]],["mediawiki.ForeignStructuredUpload.BookletLayout","j7826",[67,69,105,175,169]],["mediawiki.toc","ui5eu",[78]],["mediawiki.Uri","hrm54",[75]],["mediawiki.user","w2qqj",[38,78]],["mediawiki.userSuggest","ba9yz",[21,38]],["mediawiki.util","1pxz6",[13,9]],["mediawiki.checkboxtoggle","snz0j"],["mediawiki.checkboxtoggle.styles","10qw3"],["mediawiki.cookie","1x55y"],["mediawiki.experiments","15xww"],["mediawiki.editfont.styles","h7gqo"],["mediawiki.visibleTimeout","40nxy"],["mediawiki.action.edit","1kqfc",[24,83,80,171]],["mediawiki.action.edit.styles","u64aq"],["mediawiki.action.edit.collapsibleFooter","198xc",[18,64]],["mediawiki.action.edit.preview","7xt7u",[19,111]],["mediawiki.action.history","1c95i",[18]],["mediawiki.action.history.styles","cbdif"],["mediawiki.action.protect","gjfux",[171]],["mediawiki.action.view.metadata","1aqj6",[96]],["mediawiki.editRecovery.postEdit","wh5q0"],["mediawiki.editRecovery.edit","1r1hr",[57,168,212]],["mediawiki.action.view.postEdit","26zx1",[57,64,158,196,216]],["mediawiki.action.view.redirect","9jbdf"],["mediawiki.action.view.redirectPage","1o99f"],["mediawiki.action.edit.editWarning","15on3",[24,40,101]],["mediawiki.action.view.filepage","16rk8"],["mediawiki.action.styles","10uxz"],["mediawiki.language","1g1hv",[99]],["mediawiki.cldr","1dc8t",[100]],["mediawiki.libs.pluralruleparser","1sv4p"],["mediawiki.jqueryMsg","5tkwo",[65,98,5]],["mediawiki.language.months","md5qj",[98]],["mediawiki.language.names","11sqp",[98]],["mediawiki.language.specialCharacters","1cldx",[98]],["mediawiki.libs.jpegmeta","n7h67"],["mediawiki.page.gallery","1pso7",[107,75]],["mediawiki.page.gallery.styles","8uvjs"],["mediawiki.page.gallery.slideshow","p1lqa",[199,219,221]],["mediawiki.page.ready","1dubu",[38]],["mediawiki.page.watch.ajax","2bxko",[73]],["mediawiki.page.preview","d3mbg",[18,24,42,43,73,196]],["mediawiki.page.image.pagination","1qg8v",[19,75]],["mediawiki.page.media","1oc5n"],["mediawiki.rcfilters.filters.base.styles","jeuid"],["mediawiki.rcfilters.highlightCircles.seenunseen.styles","1u9yp"],["mediawiki.rcfilters.filters.ui","hwyet",[18,72,73,166,205,212,215,216,217,219,220]],["mediawiki.interface.helpers.styles","1fwuc"],["mediawiki.special","1aafx"],["mediawiki.special.apisandbox","i8sid",[18,186,172,195]],["mediawiki.special.restsandbox.styles","tjxcg"],["mediawiki.special.restsandbox","snzcl",[120]],["mediawiki.special.block","7etr6",[51,169,185,176,186,183,212]],["mediawiki.misc-authed-ooui","179gl",[19,52,166,171]],["mediawiki.misc-authed-pref","1fmt6",[5]],["mediawiki.misc-authed-curate","anc0a",[12,14,17,19,38]],["mediawiki.special.block.codex","pgbuv",[30,29]],["mediawiki.protectionIndicators.styles","mii98"],["mediawiki.special.changeslist","cznu8"],["mediawiki.special.changeslist.watchlistexpiry","3fiv4",[118,216]],["mediawiki.special.changeslist.enhanced","1m4ka"],["mediawiki.special.changeslist.legend","1wqsl"],["mediawiki.special.changeslist.legend.js","13r7x",[78]],["mediawiki.special.contributions","1203g",[18,169,195]],["mediawiki.special.import.styles.ooui","15hlr"],["mediawiki.special.changecredentials","1eqrg"],["mediawiki.special.changeemail","q0qtr"],["mediawiki.special.preferences.ooui","1tsai",[40,80,58,64,176,171,204]],["mediawiki.special.preferences.styles.ooui","1rlls"],["mediawiki.special.editrecovery.styles","1o89f"],["mediawiki.special.editrecovery","1nomj",[27]],["mediawiki.special.search","1slvn",[188]],["mediawiki.special.search.commonsInterwikiWidget","twkga",[38]],["mediawiki.special.search.interwikiwidget.styles","15u9w"],["mediawiki.special.search.styles","f3b8t"],["mediawiki.special.unwatchedPages","1tz16",[38]],["mediawiki.special.upload","nu80r",[19,38,40,105,118,35]],["mediawiki.authenticationPopup","zr443",[19,204]],["mediawiki.authenticationPopup.success","6zddp"],["mediawiki.special.userlogin.common.styles","f9361"],["mediawiki.special.userlogin.login.styles","6a2eo"],["mediawiki.special.userlogin.authentication-popup","114ns"],["mediawiki.special.createaccount","10bmi",[38]],["mediawiki.special.userlogin.signup.styles","zef1m"],["mediawiki.special.userrights","1des1",[17,58]],["mediawiki.special.watchlist","59oek",[196,216]],["mediawiki.tempUserBanner.styles","3pp37"],["mediawiki.tempUserBanner","wpaj9",[101]],["mediawiki.tempUserCreated","ecwit",[75]],["mediawiki.ui","1mqqz"],["mediawiki.ui.checkbox","kwkz2"],["mediawiki.ui.radio","mflx2"],["mediawiki.legacy.messageBox","g7970"],["mediawiki.ui.button","1vr9p"],["mediawiki.ui.input","1et0o"],["mediawiki.ui.icon","t1lvz"],["mediawiki.widgets","7utw2",[167,199,209,210]],["mediawiki.widgets.styles","z6m6x"],["mediawiki.widgets.AbandonEditDialog","s3y63",[204]],["mediawiki.widgets.DateInputWidget","27mhi",[170,26,199,221]],["mediawiki.widgets.DateInputWidget.styles","4vrdz"],["mediawiki.widgets.visibleLengthLimit","4i5bv",[17,196]],["mediawiki.widgets.datetime","16jk1",[196,216,220,221]],["mediawiki.widgets.expiry","e4bxs",[172,26,199]],["mediawiki.widgets.CheckMatrixWidget","1lq0f",[196]],["mediawiki.widgets.CategoryMultiselectWidget","19khw",[47,199]],["mediawiki.widgets.SelectWithInputWidget","11wi8",[177,199]],["mediawiki.widgets.SelectWithInputWidget.styles","1muue"],["mediawiki.widgets.SizeFilterWidget","1bq7m",[179,199]],["mediawiki.widgets.SizeFilterWidget.styles","jozhq"],["mediawiki.widgets.MediaSearch","1s4ub",[47,73,199]],["mediawiki.widgets.Table","hlri2",[199]],["mediawiki.widgets.TagMultiselectWidget","1y5hq",[199]],["mediawiki.widgets.UserInputWidget","1tc82",[199]],["mediawiki.widgets.UsersMultiselectWidget","1dllb",[199]],["mediawiki.widgets.NamespacesMultiselectWidget","1skcg",[166]],["mediawiki.widgets.TitlesMultiselectWidget","1xq8g",[166]],["mediawiki.widgets.TagMultiselectWidget.styles","z8nel"],["mediawiki.widgets.SearchInputWidget","kfr5t",[63,166,216]],["mediawiki.widgets.SearchInputWidget.styles","1784o"],["mediawiki.widgets.ToggleSwitchWidget","1yf2l",[199]],["mediawiki.watchstar.widgets","9n7ag",[195]],["mediawiki.deflate","wsaxh"],["oojs","1u2cw"],["mediawiki.router","1l3dg",[193]],["oojs-ui","19txf",[202,199,204]],["oojs-ui-core","qy4na",[109,193,198,197,206]],["oojs-ui-core.styles","1j6vi"],["oojs-ui-core.icons","5zaeo"],["oojs-ui-widgets","cootc",[196,201]],["oojs-ui-widgets.styles","17y8c"],["oojs-ui-widgets.icons","s5nrz"],["oojs-ui-toolbars","wt2k0",[196,203]],["oojs-ui-toolbars.icons","pqu59"],["oojs-ui-windows","11cpn",[196,205]],["oojs-ui-windows.icons","jc2n6"],["oojs-ui.styles.indicators","6v2js"],["oojs-ui.styles.icons-accessibility","1rwdc"],["oojs-ui.styles.icons-alerts","emie8"],["oojs-ui.styles.icons-content","1slg4"],["oojs-ui.styles.icons-editing-advanced","n9ton"],["oojs-ui.styles.icons-editing-citation","id1kf"],["oojs-ui.styles.icons-editing-core","1yia8"],["oojs-ui.styles.icons-editing-functions","1iz01"],["oojs-ui.styles.icons-editing-list","1y7cw"],["oojs-ui.styles.icons-editing-styling","1g3rl"],["oojs-ui.styles.icons-interactions","qnkug"],["oojs-ui.styles.icons-layout","iw5g4"],["oojs-ui.styles.icons-location","1exov"],["oojs-ui.styles.icons-media","21een"],["oojs-ui.styles.icons-moderation","o8pnr"],["oojs-ui.styles.icons-movement","cgb89"],["oojs-ui.styles.icons-user","1q6qi"],["oojs-ui.styles.icons-wikimedia","1ftz5"],["ext.fandom.SpecialDatacenterPreference","15uh1"],["ext.cite.styles","b7ofx"],["ext.cite.parsoid.styles","9ax13"],["ext.cite.visualEditor.core","nr61z",[308]],["ext.cite.visualEditor","1722o",[226,225,227,208,211,216]],["ext.cite.wikiEditor","1g78n",[348]],["ext.cite.ux-enhancements","kjjoh"],["ext.categoryTree","1cxh1",[38]],["ext.categoryTree.styles","5xf2l"],["ext.charinsert","1szkj",[24]],["ext.charinsert.styles","17hc7"],["ext.inputBox.styles","gohm7"],["ext.math.mathjax","1i46g",[],3],["ext.math.styles","7xrei"],["ext.math.popup","1ank0",[47,73]],["mw.widgets.MathWbEntitySelector","fe2lq",[47,166,"mw.config.values.wbRepo",204]],["ext.math.visualEditor","11uw0",[237,300]],["ext.math.visualEditor.mathSymbols","1s84f"],["ext.math.visualEditor.chemSymbols","v2vmu"],["ext.scribunto.errors","5a2hb",[199]],["ext.scribunto.logs","7b36r"],["ext.scribunto.edit","746yk",[19,38]],["ext.pygments","d1din"],["ext.geshi.visualEditor","1bp42",[300]],["ext.disambiguator","1s13f",[38,57]],["ext.disambiguator.visualEditor","1uxyn",[307]],["mediawiki.api.titleblacklist","1amyv",[38]],["ext.titleblacklist.visualEditor","9cn1x"],["ext.fandom.MessageWall.messages","di6jd"],["ext.Tabber","1atty",[72]],["ext.confirmEdit.editPreview.ipwhitelist.styles","nwoqf"],["ext.confirmEdit.visualEditor","bl2yi",[1062]],["ext.confirmEdit.simpleCaptcha","11oss"],["ext.confirmEdit.reCaptchaNoCaptcha.visualEditor","1t0zs",[9]],["ext.fandom.visualEditor.pluginLoader","1upiw"],["socket.io","f0oz7"],["peerjs","1a7xj"],["dompurify","1x96n"],["color-picker","1udyk"],["unicodejs","1pa89"],["papaparse","1b87h"],["rangefix","py825"],["spark-md5","1ewgr"],["ext.visualEditor.supportCheck","mk13r",[],4],["ext.visualEditor.sanitize","1klwy",[261,288],4],["ext.visualEditor.progressBarWidget","170cc",[],4],["ext.visualEditor.tempWikitextEditorWidget","vbaxg",[80,73],4],["ext.visualEditor.desktopArticleTarget.init","1maew",[269,267,270,284,24,109,64],4],["ext.visualEditor.desktopArticleTarget.noscript","1kets"],["ext.visualEditor.targetLoader","1u4zt",[287,284,24,64,73],4],["ext.visualEditor.desktopTarget","1fs2v",[],4],["ext.visualEditor.desktopArticleTarget","1tn7b",[291,296,274,302],4],["ext.visualEditor.mobileArticleTarget","hr2zp",[291,297],4],["ext.visualEditor.collabTarget","ozonr",[289,295,80,166,216,217],4],["ext.visualEditor.collabTarget.desktop","1sbk2",[277,296,274,302],4],["ext.visualEditor.collabTarget.mobile","yjg97",[277,297,301],4],["ext.visualEditor.collabTarget.init","38j90",[267,166,195],4],["ext.visualEditor.collabTarget.init.styles","1rppu"],["ext.visualEditor.collab","n28x7",[262,293,260]],["ext.visualEditor.ve","17m0y",[],4],["ext.visualEditor.track","10mz7",[283],4],["ext.visualEditor.editCheck","1deti",[290],4],["ext.visualEditor.core.utils","t3nsm",[284,195],4],["ext.visualEditor.core.utils.parsing","1rcro",[283],4],["ext.visualEditor.base","czk1e",[286,287,263],4],["ext.visualEditor.mediawiki","3wqj1",[288,273,22,1063],4],["ext.visualEditor.mwsave","2z77u",[300,17,19,42,43,216],4],["ext.visualEditor.articleTarget","30o36",[301,290,92,168],4],["ext.visualEditor.data","xgrw4",[289]],["ext.visualEditor.core","109a5",[268,267,264,265,266],4],["ext.visualEditor.commentAnnotation","6y11s",[293],4],["ext.visualEditor.rebase","8jfqr",[262,311,294,222,259],4],["ext.visualEditor.core.desktop","nkcg2",[293],4],["ext.visualEditor.core.mobile","1ttqu",[293],4],["ext.visualEditor.welcome","1rlzo",[195],4],["ext.visualEditor.switching","33s55",[195,207,210,212],4],["ext.visualEditor.mwcore","1t049",[312,289,299,298,117,62,8,166],4],["ext.visualEditor.mwextensions","19txf",[292,322,316,318,303,320,305,317,306,308],4],["ext.visualEditor.mwextensions.desktop","19txf",[301,307,70],4],["ext.visualEditor.mwformatting","zrbvg",[300],4],["ext.visualEditor.mwimage.core","1yswc",[300],4],["ext.visualEditor.mwimage","hglwg",[323,304,180,26,219],4],["ext.visualEditor.mwlink","1wzyu",[300],4],["ext.visualEditor.mwmeta","m3llz",[306,94],4],["ext.visualEditor.mwtransclusion","195wp",[300,183],4],["treeDiffer","xiskm"],["diffMatchPatch","1s80q"],["ext.visualEditor.checkList","1gms3",[293],4],["ext.visualEditor.diffing","1dy5t",[310,293,309],4],["ext.visualEditor.diffPage.init.styles","vr7kr"],["ext.visualEditor.diffLoader","1umb0",[273],4],["ext.visualEditor.diffPage.init","1i1uo",[314,313,195,207,210],4],["ext.visualEditor.language","yq7f6",[293,1063,103],4],["ext.visualEditor.mwlanguage","zev3g",[293],4],["ext.visualEditor.mwalienextension","1h689",[300],4],["ext.visualEditor.mwwikitext","2yvnz",[306,80],4],["ext.visualEditor.mwgallery","1n3mm",[300,107,180,219],4],["ext.visualEditor.mwsignature","uovdf",[308],4],["ext.visualEditor.icons","19txf",[324,325,208,209,210,212,214,215,216,217,220,221,222,206],4],["ext.visualEditor.icons-licenses","zs5zf"],["ext.visualEditor.moduleIcons","1xg8q"],["ext.visualEditor.moduleIndicators","ko48t"],["ext.imagemap","pugeb",[327]],["ext.imagemap.styles","ftwpn"],["ext.checkUser.clientHints","wqgkj",[38,11]],["ext.checkUser","1yar1",[22,61,64,73,166,183,212,216,218,220,222]],["ext.checkUser.styles","8yb7m"],["ext.sm.common","1xe8o"],["ext.maps.geojson.new.page","lok4y",[38]],["ext.maps.geojson.page","1pnli",[341]],["ext.maps.resizable","19txf",[25]],["ext.maps.api","1wvff",[38]],["ext.maps.leaflet.library","1zhql"],["ext.maps.leaflet.fullscreen","1comj",[336]],["ext.maps.leaflet.geojson","f6xq6"],["ext.maps.leaflet.loader","1jmla",[335,337,338,340,331]],["ext.maps.leaflet.markercluster","1835s",[336]],["ext.maps.leaflet.editor","15bxn",[335,337,338,73]],["ext.maps.googlemaps3","oqgma"],["ext.maps.gm3.markercluster","vtzzq",[342]],["ext.maps.gm3.markerwithlabel","1tn6v",[342]],["ext.maps.gm3.geoxml","1u2y6",[342]],["ext.maps.googlemaps3ajax","1b63u",[342,331]],["ext.maps.wikitext.editor","11x51",[25]],["ext.wikiEditor","pz2o9",[24,25,104,73,166,211,212,214,215,219,35],5],["ext.wikiEditor.styles","1pjfr",[],5],["ext.wikiEditor.images","s1eop"],["ext.wikiEditor.realtimepreview","11xg2",[348,350,111,62,64,216]],["ext.MsUpload","10emr"],["ext.fandom.CreatePage.js","n4ms0",[440,10]],["ext.categorySelect.js","1ntdw",[535,532,534]],["ext.fandom.abuseFilter.aceEditor.js","botdb",[440,10]],["ext.fandom.Achievements.js","wmcqn",[534,741]],["ext.fandom.Achievements.SpecialLeaderboard.js","1e41c",[621,741]],["ext.fandom.Activity.tabs.js","r5vhb",[531]],["ext.fandom.AdminDashboard.fandomdesktop.js","oskgx",[555,556,535]],["ext.fandom.AdminDashboard.WikiFeatures.js","xw5d3",[535,558,543]],["ext.fandom.ae.consentQueue.js","1f6bo",[440,10]],["ext.fandom.Alcatraz.js","wdh5j",[527]],["ext.fandom.AnalyticsEngine.quantcast.js","7qy42",[684,630]],["ext.fandom.ArticleComments.desktop.js","1025e",[533,693]],["ext.fandom.ArticleComments.mobile.js","ua91c",[533,693]],["ext.fandom.ArticleInContentPlayer.desktop.js","1606l",[660]],["ext.fandom.ArticleInContentPlayer.mobile.js","1rnne",[660]],["ext.fandom.ArticleVideo.desktop.js","1cgpv",[694,543]],["ext.fandom.ArticleVideo.mobile.js","h2w9n",[694,543]],["ext.fandom.Auth.preferences.js","d7vk0",[527]],["ext.fandom.bannerNotifications.migrationBanner.js","sba0r",[527]],["ext.fandom.baselayout.js","le3qo",[643,543,642]],["ext.fandom.CategoryPage.CategoryLayoutSelector.js","1yh9r",[621]],["ext.fandom.CategoryPage.mobile.js","16dne",[535]],["ext.fandom.ContentReview.jsReload.js","rdbd2",[440,10]],["ext.fandom.ContentReview.legacyLoaders.js","uky05",[440,10,75]],["ext.fandom.ContentReview.reviewActions.js","gtkmf",[527,534]],["ext.fandom.ContentReview.submit.js","1d2z1",[527,534]],["ext.fandom.ContentReview.testModeBanner.js","1vjyk",[527,534]],["ext.fandom.CreatePage.Dialog.js","3im0o",[535,534]],["ext.fandom.CreatePageOpenDialog.js","1ec39",[555]],["ext.fandom.creatorMetrics.wikiEditor.js","1qnl6",[440,10]],["ext.fandom.DatacenterPreference.js","1gven",[535,580]],["ext.fandom.DiscussionMaintenance.js","1invg",[527]],["ext.fandom.dismissableSitenotice.js","tw9go",[621]],["ext.fandom.Email.SpecialSendEmail.js","qxnst",[537,538,533]],["ext.fandom.FacebookLocale.js","a078j",[572]],["ext.fandom.FacebookTags.js","4g0tn",[533,622]],["ext.fandom.FandomThanks.mobileDiff.js","1hg22",[440,10]],["ext.fandom.FandomThanksChangesList.js","s6her",[528]],["ext.fandom.FandomVisualEditor.mobileEditSection.js","1gdav",[440,10]],["ext.fandom.ForumRedirect.legacyLinkHider.js","176m0",[440,10]],["ext.fandom.FounderProgressBar.js","1umi6",[556]],["ext.fandom.GalleryTracking.js","1uyso",[535,533]],["ext.fandom.GTM.js","12btn",[710,684,630]],["ext.fandom.ImageGalleryIconModuleInit.js","lf7kn",[714,533]],["ext.fandom.Insights.js","k3iem",[543]],["ext.fandom.InteractiveMaps.SpecialReports.js","1hzg1",[595,600,533]],["ext.fandom.InteractiveMaps.js","m5el9",[736,75]],["ext.fandom.InteractiveMapsSourceEditor.js","1y6ym",[594]],["ext.fandom.InterwikiEdit.js","1l2ks",[440,10,101]],["ext.fandom.ListGlobalUsers.js","1jjj1",[440,10]],["ext.fandom.listUsers.js","b6rtv",[527,199]],["ext.fandom.MapsTracking.js","74adq",[535]],["ext.fandom.MigrationSchedule.js","5yvl9",[533]],["ext.fandom.MigrationTableAndFormTools.js","1qu4p",[678,533]],["ext.fandom.MobileImageGallery.Navigational.js","1ytqr",[670,529,622]],["ext.fandom.multiTasksMultiDelete.js","vpx4f",[527,38]],["ext.fandom.NewFilesFilters.js","1r1ix",[533]],["ext.fandom.nositenotice.js","4xh1s",[637]],["ext.fandom.Phalanx.block.js","inlf3",[527,534]],["ext.fandom.Phalanx.blockExclusion.js","fkwhf",[527,543]],["ext.fandom.Phalanx.blockListing.js","1h6ax",[527]],["ext.fandom.PhalanxStats.js","mmgcr",[527]],["ext.fandom.photoGallery.gallery.js","1tjl9",[575,679,605]],["ext.fandom.photoGallery.slider.js","zfygi",[575,533]],["ext.fandom.QuickAdopt.js","1a34r",[204,606]],["ext.fandom.QuickAnswers.specialSpecialPagesTracking.js","19qup",[535]],["ext.fandom.QuickTools.js","57uqx",[73,534,204,606]],["ext.fandom.Sentry.loader.js","13d0p",[557,543]],["ext.fandom.ServerSideExperiments.js","16opd",[539,621,543,652]],["ext.fandom.SilverSurferLoader.trackingWelcomeTool.js","dtq55",[535]],["ext.fandom.sitenotice.mobile.js","1yotf",[543,637]],["ext.fandom.slider.js","1wbkv",[575,548]],["ext.fandom.SocialLogs.js","ovqzk",[543]],["ext.fandom.specialVideos.js","1x2w7",[527]],["ext.fandom.Tabber.js","1mz86",[533,642]],["ext.fandom.ThemeDesignerNextMobileThemingAppliedAdminBanner.js","1lofk",[609,527]],["ext.fandom.ThemeDesignerNextMobileThemingBanner.js","13szr",[527]],["ext.fandom.TwitterTag.js","tuoiw",[533]],["ext.fandom.UncrawlableUrl.anchors.js","1xmot",[533,611]],["ext.fandom.UncrawlableUrl.spans.js","1vdy0",[533,611]],["ext.fandom.UnifiedCommunitySearchTracking.js","1d1xx",[712]],["ext.fandom.UnifiedSearchTracking.js","8m98p",[712]],["ext.fandom.uploadNewImages.js","10m3i",[564,612,679,534]],["ext.fandom.UserProfileActivity.js","37nhn",[620,534]],["ext.fandom.WDACReview.js","18cu4",[440,10]],["ext.portableInfoboxFandomDesktop.js","98bwa",[440,10]],["ext.tabView.editor.js","jjz0l",[440,10]],["fandomRequire.js","19onv"],["floatingScroll.js","18cjw",[533]],["skin.fandomdesktop.rail.toggle.js","frjd8",[589,607,613]],["skin.fandommobile.ActionHistory.js","1ortp",[440,10]],["skin.fandommobile.mobileApp.js","wfztn",[440,10]],["skin.fandommobile.MobileDiff.js","1uvfl",[440,10]],["skin.fandommobile.RecirculationPrefooter.init.js","1so6c",[440,10]],["skin.fandommobile.trackContributions.js","16yqj",[615]],["skin.fandommobile.trackHistoryPage.js","jh8ds",[615]],["skin.fandommobile.trackMobileDiff.js","1lei6",[615]],["skin.fandommobile.trackRecentChanges.js","1q6ry",[615]],["skin.fandommobile.trackUndoEdit.js","1dz42",[615]],["ext.fandom.AgeGate.loader.js","1sxvq",[561,711,621,557,630,631]],["ext.fandom.BaseGlobalComponents.MobileGlobalNavigation.js","10gfy",[676,567]],["ext.fandom.BaseGlobalComponents.MobileGlobalNavigationAnon.js","eit2k",[676,567]],["ext.fandom.GlobalComponents.MobileGlobalNavigation.js","qcc8h",[697,567,647]],["ext.fandom.GlobalComponents.MobileGlobalNavigationAnon.js","2dl8l",[697,567,647]],["ext.fandom.GlobalComponents.StickyNavigation.js","wohfr",[590,647]],["ext.fandom.GlobalShortcuts.js","1fdde",[669,557,101]],["ext.fandom.ImageGalleryIconModuleMobileInit.js","12dkt",[714,533]],["ext.fandom.JWPlayerTag.js","5usyc",[535,571,533]],["ext.fandom.Migration.js","gcpqo",[533,542,624]],["ext.fandom.MobileImageGallery.Default.js","2c3rr",[670,620,536,529,548,622]],["ext.fandom.phalanx.visualEditor.js","1c7sv",[291,440,10]],["ext.fandom.photoGallery.slideshow.js","16jls",[575,679,605,632]],["ext.fandom.sitenotice.desktop.js","99v6x",[637]],["ext.fandom.Track.conviva.js","1ye28",[541]],["ext.fandom.visualEditor.mobile.init.js","1s95d",[273,587,704,586]],["ext.portableInfobox.mobile.js","154gc",[535,542]],["ext.tabView.js","112wf",[537,538,679,711,683,553,622]],["shared.jquery.autocomplete.js","1w52c",[440,10]],["skin.fandomdesktop.rail.lazyRail.js","631fs",[740,567,607,613]],["ext.categorySelect.lazy.js","r22yr",[535,541,542,534,199,624,741]],["ext.fandom.ae.adManagerApi.js","e4w09",[679,541,708,630,631,622]],["ext.fandom.announcements.js","oovva",[527,199,204,221]],["ext.fandom.Blogs.js","kgxq2",[535,534,199,204]],["ext.fandom.GlobalComponents.CommunityNavigation.js","1twat",[575,590,647,721]],["ext.fandom.TimeAgoMessaging.js","1r1b9",[533,101]],["ext.fandom.Track.js","1w88q",[570,706,610,684,533]],["ext.fandom.wikiaBar.js","5o9lz",[555,535,541,548,533]],["ext.fandom.BaseGlobalComponents.GlobalExploreNavigation.js","uxl1a",[567,722,543,636]],["ext.fandom.BaseGlobalComponents.GlobalFooter.js","a207c",[543,677]],["ext.fandom.GlobalComponents.CommunityHeader.js","s98dk",[687,647,640,588]],["ext.fandom.GlobalComponents.GlobalFooter.js","gz4xl",[647,543,588]],["ext.fandom.InteractiveMaps.allmaps.js","1g4q6",[535,600,543]],["ext.fandom.SuggestedPages.js","18tcp",[535,558,608,543,624]],["ext.fandom.tcs.dialog.js","bvuc8",[527,649,199,204,604]],["ext.fandom.Activity.social.js","1d8vn",[531,679,542,196]],["ext.fandom.AgeGate.js","1o7p8",[633,679,740,547,560]],["ext.fandom.communityPage.js","jz1ls",[535,542,534,624]],["ext.fandom.FandomVisualEditor.mobile.js","pqn5w",[695,291,297,307,319,587,586,585]],["ext.fandom.NaR.gamespotNews.js","egdwd",[711,539,544,698,603,543,550,689]],["ext.fandom.performanceMonitoring.js","1usti",[710,538,580,567,572,73,652]],["ext.fandom.photoGallery.gallery.lazy.js","14reu",[706,605]],["ext.fandom.wikiaBar.lazy.js","1t7gg",[612,580,527,534,199]],["ext.fandom.WikiAnalytics.js","sssc7",[579,671,728,665]],["ext.fandom.curatedContentSpecialPage.js","1w9sa",[541,734,533,560]],["ext.fandom.Lightbox.js","vlyph",[564,541,740,527,568,534,641,632]],["ext.fandom.SpecialWidgetPlayground.js","atmms",[709,711,672,543]],["ext.fandom.GlobalShortcuts.lazy.js","17wu4",[669,542,624]],["skin.fandommobile.RecirculationPrefooter.js","udt0h",[570,535,679,614,596,534,624,632]],["ext.fandom.GlobalComponents.CommunityBar.js","1yk0d",[687,567,647,640,588]],["ext.fandom.ExperimentTRFC161.js","1nco2",[558,646,682,681,550,560]],["ext.fandom.wikiEditor.js","adbdl",[535,299,696,548,533]],["ext.fandom.TableProgressTracking.js","1v2ba",[580,558,533,560]],["ext.fandom.GlobalComponents.GlobalTopNavigation.js","1r0gt",[575,591,567,647,721,668,593,718]],["ext.fandom.GlobalComponents.GlobalExploreNavigation.js","1yqdf",[567,647,592,578,713,718,543,550,636]],["ext.fandom.NaR.mobileStatsFanFeed.js","st0qn",[535,679,671,711,744,544,603,543]],["ext.fandom.AdEngine.SpecialMonetization.js","se09s",[536,679,711,552,554,629,547,682,548,681,549,546,553,544,543,550,622]],["ext.fandom.HighlightToAction.js","5lzit",[535,679,580,711,545,634]],["ext.fandom.EditorTaskBoard.js","nukef",[644,558,554,629,545,666,664,553,645,543,685,560]],["ext.fandom.UserProfile.js","109oz",[679,711,547,681,683,584,534,560]],["ext.fandom.BaseGlobalComponents.GlobalTopNavigation.js","9k81b",[575,567,661,574,638,722,639]],["ext.fandom.CreateNewWiki.js","1f1uf",[564,679,577,552,578,547,682,548,681,738,685,550,560]],["skin.fandommobile.js","1h9v2",[640,568,534,642,715,588,615,632,585]],["ext.fandom.DiscussionsAbuseFilter.js","5krg1",[633,561,558,582,552,713,547,686,681,664,583,584,543,665,720,560]],["ext.fandom.QuickAnswers.js","4t0tc",[644,558,602,554,666,681,664,553,601,645,665,685,560]],["ext.fandom.MessageWall.js","m7uhp",[737,651,541,562,534,560]],["skin.fandomdesktop.js","18n6d",[555,589,709,591,711,643,592,640,441,572,101,530,550,642,636,715,588,613]],["ext.fandom.ArticleComments.js","1lzvi",[737,693,685,560]],["ext.fandom.ThemeDesignerNext.js","61g70",[599,609,558,552,742,686,681,734,685,663,598]],["ext.fandom.NewInfoboxBuilder.js","1xhi1",[727,558,552,742,646,681,546,734,702,685,604]],["ext.fandom.visualEditor.js","z7pnv",[695,527,275,319,532,704,636,598,586]],["ext.fandom.InteractiveMapEditor.js","dt7eo",[591,688,650,599,708,552,682,681,583,581,549,543,702,594,598]],["ext.fandom.WikiConfig.js","pmp2q",[595,651,558,582,552,742,554,629,646,666,548,681,664,583,601,544,559,543,101,728,685]],["ext.fandom.Sentry.js","17saa",[440,10]],["skin.fandommobile.MobileDrawer.js","xlga1",[736,610,650,567,690,569,548,581,698,568,543,630,689]],["ext.fandom.bannerNotifications.js","z6jul",[535,542,624]],["ext.fandom.ThanksTracking.js","h37ii",[535]],["ext.fandom.Thumbnails.js","7ayrr",[440,10]],["skin.fandomdesktop.gallery.js","yamq6",[533]],["ActivityFeedTracking-Dj8jeHfd.js","2jdfc",[535,533]],["jqueryFandomExtensions-Cjor3_Zn.js","1l9dc",[533]],["jquery-BjFuOzD4.js","8zrrb",[440,10]],["nirvana-CF2LOj1N.js","3pac7",[533]],["Tracker-X6l3lvFw.js","xvfc8",[710,538]],["_define_property-BS3YYi8G.js","1r35b",[440,10]],["_object_spread-Czkdil6m.js","epgre",[536]],["_object_spread_props-BwOhuI8I.js","1av8b",[440,10]],["env-B6wlgd82.js","10s8m",[537,678]],["_commonjsHelpers-Cyo8WBrJ.js","pon7c",[440,10]],["_type_of-CrhBk94O.js","vn4os",[440,10]],["mustache-DBEtaZBl.js","1iz57",[440,10]],["load-B-HR9-cN.js","1if22",[440,10]],["index-YVjOE6li.js","3huv9",[627,545]],["index-CIv83_KC.js","hufad",[626,680,625]],["index-Dmr-AX0-.js","6f4u5",[680]],["index-C2XGgias.js","6ne84",[680,625]],["index-Crx1YJIV.js","w64bc",[440,10]],["index-DXfGcNBV.js","z0xtx",[626,680,625]],["style-inject.es-C5GBklBY.js","1rwpi",[440,10]],["index-DwLzB8vM.js","bbn43",[680]],["index-B2U5b5pP.js","d2y79",[628,626,625]],["index-DqUFvW2e.js","mscw4",[626,680,625]],["index-BmMX-TYT.js","2xgqk",[626,680,625]],["CreatePage-CdPBb9ev.js","ol99b",[557]],["FounderProgressBar-CtFYkcdA.js","1h6ks",[534]],["lazyModules-BQPsc3bJ.js","td3gu",[622]],["fetch-DR8F5EeO.js","1ctai",[620,537,538,679,662,622]],["isSymbol-CaWXls-n.js","wn2s8",[739]],["utils-BGXGkV_n.js","1jgpy",[527,632]],["ModalPortalProvider-Bc7XweyR.js","qyl93",[679,680]],["index-CYtrOXxd.js","z22nr",[440,10]],["objectSpread2-D1S-nOf0.js","cbecv",[716]],["AuthModal-kUrw9SYx.js","1lgtf",[535,533]],["Timeago-CS5ustAn.js","bnjkv",[635,683,634]],["index-DfKWICcT.js","xt0qt",[680]],["consts-B-3D9pWT.js","138st",[440,10]],["initializeFandomAds-kqAXzADD.js","fvp02",[440,10]],["getExperimentState-BM1HoR4p.js","4sb6c",[440,10]],["ICBMCommunication-Brpb40zi.js","1jfgo",[630,631]],["featured-video-cookies-CgH6tqzM.js","1f2w7",[621]],["geo-CJDOL6aW.js","x5bxf",[621]],["isInViewport-COEvKgGj.js","1nl26",[440,10]],["index-Beyexs0X.js","15xhr",[440,10]],["ImpressionTracker-YM9MuvJf.js","1l0j4",[535,543]],["pathfinder-BxpM5Ld-.js","1aubd",[680]],["index-31nxZctt.js","hybo4",[680]],["index-BLudW1Ik.js","1ef4m",[680]],["_arrayPush-DS9OR4Az.js","39u9a",[440,10]],["browserDetect-BaKlc0ik.js","152n5",[440,10]],["index-DSSLdDaF.js","gm8ng",[680]],["index-B2B_fmXm.js","1j0l0",[738]],["index-DA1u2vRv.js","1w1mn",[628,626,625]],["index-DGl_qWdk.js","1ccq0",[626,680,625]],["wrapTables-AvPgGjSr.js","bexm4",[440,10]],["visualEditorTracking-C8Nz-tRi.js","1bb1t",[535,533]],["mobile-utils-YcsyQuSQ.js","194fl",[440,10]],["tracking-CaDjR4iB.js","103ff",[535,684,730,548,573,630]],["PreferencesHelper-CFPQc2Ml.js","177od",[539,621,622]],["StickyWikiNavigation-DjuOWZu_.js","rotuu",[591,539,548]],["StickyWikiNavigationShared-Dz0q0Ktz.js","ssttq",[440,10]],["consts-s60qVZxC.js","1l8w8",[440,10]],["index-CcElL5qd.js","llqog",[440,10]],["tracking-D9tXoOG9.js","8du8t",[597]],["Notification-CqunRXjm.js","17cly",[560]],["eventLogger-D_8Kn396.js","1m2tz",[533]],["tracking-DNwgfRXd.js","1j8q7",[535]],["variables-CfwVzWAq.js","17szp",[440,10]],["cssMath-Blc9Ceb9.js","xbyra",[679]],["api-DWmohI9U.js","1sudm",[537,679,622]],["index-Dv3ix_tC.js","1cp4r",[626,566,625]],["index-B_teYv0D.js","1f4b5",[680]],["installmentMapping-Coa2vHXR.js","1z9j0",[622]],["tracking-BCWoF4gI.js","1q1j6",[535]],["utils-Bva0kdhM.js","16vfb",[564]],["quickToolsShared-C6d6bwkj.js","1fm8u",[527]],["consts-Dv3bPPJ4.js","8iobw",[440,10]],["getItemThumbnailUrl-DWQGVlPH.js","75lum",[632]],["env-DgD53aZj.js","1eozq",[440,10]],["algolia-8QP2QN2p.js","1lfde",[710]],["uncrawlable-url-utils-DFgRfLLd.js","1a4zz",[440,10]],["Toggle-Cu_FFepR.js","1tvol",[620]],["trackingUtils-DAWwzcIP.js","x3sf8",[535]],["escapeHtml-B1PjaJwf.js","62vuz",[440,10]],["trackingUtils-CaU-a3EL.js","fzm8p",[535]],["MenuPanel-BEwbRKHx.js","mkrdl",[655]],["ExplorePanel-C_rdibk5.js","1f3xt",[655,569]],["HistoryPanel-B28qqc7c.js","1fzuk",[655]],["panelHeaderScrollObserver-BF7ttdjY.js","1yl4n",[679,680]],["_create_class-CVg0P84R.js","dyxtn",[440,10]],["js.cookie-BsVx4kCt.js","qek2n",[540]],["tslib.es6-o5t7IqQz.js","1ex3t",[440,10]],["_unsupported_iterable_to_array-DfCX8vQ2.js","128cw",[440,10]],["svg-8X_x-kRl.js","jkuyn",[440,10]],["tslib.es6-c0cde917-D3JG3kvp.js","1w4jt",[440,10]],["index-BUbqVfk1.js","vw2je",[540]],["index-BRZEaHoE.js","p8ecf",[626,551,625]],["index-BLY2qjk6.js","15zrc",[680]],["index-Bp0xB-jS.js","1rgq3",[626,680,625]],["ofType-cum6nKD-.js","l4rst",[740]],["take-By1OHix9.js","d8529",[740]],["vignette-D9l8oI8A.js","lt14y",[540]],["Modal-ChL89Mlq.js","1a13e",[626,683,680,550]],["useTranslation-jTn9ikm-.js","11481",[680]],["index-BLOCNG6P.js","vypqf",[680,625]],["tooltips-BYh0x3gF.js","1uk87",[440,10]],["sitenoticeVisibility-DLO9ntcB.js","12ox9",[535,740]],["index-CR-RDObF.js","fx0tv",[680]],["searchModalUtils-1ZPIIA5a.js","rdw37",[677]],["dropdowns-5AYfeaia.js","6e135",[641]],["touch-screen-CsZNuxGe.js","4nwdr",[440,10]],["tabs-bT1D9HKa.js","s9uyo",[540,624]],["collapsible-panels-COai7_4Y.js","1mk9x",[440,10]],["Portal-B1F5D19R.js","1v7cg",[679,711,550]],["index-hIp_VIrm.js","117g0",[646]],["index-CRFgqJdv.js","1yx30",[711,626,547]],["consts-C1Hqy5ku.js","tseyt",[620,536]],["searchModalUtils-CNet_jSH.js","azr9r",[588]],["mousetrap-CZufTLTV.js","1t4bw",[540]],["api-DbnD2sSA.js","1q269",[743]],["_rollupPluginBabelHelpers-a94a3675-CzQYCLmi.js","iv3jt",[440,10]],["parseExpBucketCookie-RI1_tggW.js","185zz",[679]],["index-yKJ6GZin.js","3i5v6",[713]],["UserPanel-mDn9ffCQ.js","3y1qc",[713,677]],["PanelSpinner-D0hayhGT.js","aj01q",[553,550]],["UserPanel-L2ABRoSa.js","1ufns",[539,713]],["useImpression-Dh1Y-u3s.js","11vzl",[718]],["ExplorePanelContent-CKZ-4cXI.js","1st8f",[724,567,690,553,619]],["HistoryPanelContent-D50N3JeM.js","12ur1",[506,545,619,657]],["getAnyClipWidgetName-1sXr6UeO.js","ovxgu",[567,569,705,568,543,717]],["getUnreadNotificationsTotal-BkFwe1t0.js","cr8z7",[576,637,677]],["_wrap_native_super-Xae7pNvK.js","tfbhk",[706]],["toString-S2WXarFt.js","1vngh",[559]],["index-D2metOo3.js","matrc",[626,566,551,625]],["moment-BpY2Gdf5.js","3wbfx",[540]],["index-CU4kgJzY.js","331d7",[711]],["useWindowSize-rKL3zJCT.js","112q4",[679,548,680]],["getUnreadNotificationsTotal-tlhu64Yw.js","y8tuc",[576,637]],["GlobalShortcuts-D0LAv3bC.js","5yjf6",[535,679,533,649]],["ViewMore-L2yRyjhd.js","100rj",[440,10]],["chart-BqFsbXqL.js","1xruu",[440,10]],["index-CT79k7ap.js","1qjkf",[698]],["MenuPanel-OPf__Qux.js","lbw67",[553,550]],["initNotifications-OL4cJ7A_.js","wojme",[725,722]],["initNotifications-n0sYQvM0.js","170mw",[726,718]],["MobileGlobalNavigationTracking-BcBYVH8X.js","bsnkk",[640,661,719]],["tracking-BVTlUSz-.js","1li25",[535,684,730,548,573,630]],["_to_consumable_array-Cs8tLCwI.js","11q62",[623]],["_sliced_to_array-BqkCFxvp.js","63n9x",[623]],["index-gVf2G9FK.js","1pt14",[540]],["index-CyDJqmYO.js","wjjgn",[628,545]],["index-CqNfMSQp.js","114va",[626,680,625]],["index-D64XK6P4.js","vylig",[540]],["first-D5F7QzLr.js","yka03",[631]],["redux-toolkit.esm-DbEVELR9.js","ffa3g",[562,732]],["index-CCjfwk2r.js","p386a",[577,626,581,625]],["WikiTools-LoeYvR8J.js","13fai",[589]],["_isIterateeCall-DvhtMeAU.js","vkcx7",[733]],["useCarouselTouchEvents-4422eef9-Dda6prm8.js","ojvaz",[680]],["getDataIndex-Dkjcto4O.js","i2wb0",[679,539,680,622]],["MenuPanelContent-DlOrknyc.js","ctb3s",[545,707,703,718,619,550,624]],["Uxfcp6369ExploreContent-DO2rJ_Id.js","fkwiw",[658]],["loadAC-3jE-Ui8J.js","7ytyt",[535]],["initFeaturedVideo-MHkJd-vX.js","wbsn4",[567,571,684,572,569,548,705,568,717]],["FandomMWSaveDialog-CttquzpB.js","1kknd",[535,696,548]],["index-B2mk7Dwy.js","1sk14",[620,706,679]],["MobileGlobalNavigationTracking-5a5SQY3v.js","160yi",[640,668,719,588]],["index-rUXLrUWb.js","wlrco",[744]],["initMobileNotifications-DErev7EC.js","1jb7k",[676,725,711,547]],["initMobileNotifications-BnDAOTC4.js","1ywxc",[697,726,711,547]],["MenuPanelContent-DS4CILxj.js","yhwb7",[545,707,703,722,550,624]],["react-beautiful-dnd.esm-Cr_WSthg.js","1yjp2",[720,732]],["index-DOVGQT1A.js","feowj",[680]],["textAreaTracking-DRaWIXr4.js","erx7l",[535,548]],["initVideoPerformanceMarks-po4nZfb-.js","11mnp",[570,679,622]],["_inherits-C2zIenNX.js","1wihi",[541]],["index-CUJR_8cc.js","89k4q",[680]],["get-CXTYl9kI.js","1kwdc",[663]],["RecentImagesModule-2L2un8OW.js","1ndix",[679,607,608,635,698,560]],["InternalTracker-DAMJobOy.js","ss1qi",[620,539,621,622]],["client-CzBcU33f.js","1oti3",[680]],["tracking-B-KE_UPl.js","oa608",[535,610,580,684,630]],["index-BlLI9Mj5.js","1tb2y",[626,680,625]],["ImageGalleryIconApp-J_7R1Dyy.js","1382c",[620,706,711,634]],["trackScroll-CT99Z4Mw.js","li6ea",[575,548]],["defineProperty-DTDVixbU.js","1x34v",[540]],["video-player-C1L3lqwn.js","acmp5",[740,730]],["initPanel-BSo73QAg.js","12qlu",[711,626,588,667]],["takeUntil-Bk4R9063.js","cw2ih",[740]],["react-select.esm-d0BG3fxi.js","l93z5",[711,735]],["consts-CLV7oXpV.js","5r9v5",[711,626,638,648,667]],["initPanel-Fhpx9RQ4.js","12zty",[679,711,626,677]],["MobileSearchModal-BDTfwsdH.js","1bj5r",[679,711,547,545,664,639,550,636,634]],["addWikiId-BCrlnJaO.js","1wv6a",[610,569,627,672,601,550,657]],["NotificationsContent-BVqwnC82.js","uaef3",[565,679,662,614,661,578,574,545,553,653,550,632]],["NotificationsContent-DusnjuOS.js","1na4w",[565,679,662,614,668,578,545,593,553,653,550,588,632]],["_initCloneObject-BBsR9nmO.js","gn2nq",[733]],["merge-DHC7I5CK.js","dbduq",[727,688]],["Uxfcp6515ExplorePanelContent-BD0OUIVM.js","7mj7p",[724,567,690,553,619,717]],["index-CCe1j-iu.js","4xsma",[540]],["MobileSearchModal-Ccw5W7aw.js","1rt31",[679,711,572,547,545,664,648,550,636,634]],["redux-CrU-b0pX.js","umdxa",[711,683,563]],["isArrayLike-D1U7j6W2.js","1p05z",[739]],["isEqual-CHS9PAA5.js","q1md3",[579,733]],["emotion-cache.esm-Bl7MRoYO.js","5ziuj",[716,680]],["App-BfyDxHBb.js","am2cf",[558,552,602,601,743]],["DeleteCommentModal-D9o-Rlkd.js","12uoj",[564,633,561,565,552,713,547,681,664,553,732]],["index-mdqavpgM.js","lz7nc",[711,735,628,553,563]],["_MapCache-BAckbdSk.js","ayfkh",[540]],["communicationService-wvothAz3.js","1i50n",[620,537,538]],["tippy.esm-DMPSyIir.js","32no1",[440,10]],["index-BfRVJZZZ.js","h01ef",[644,706,596,628,547,545,553,720,560]],["popup.machine-CknUHIUz.js","12590",[564,595,600,580,742,713,664,734,597]],["index-D2FS9NTj.js","1ii8o",[578,547,545,703,551]],["ext.categorySelect.css","1oupn",[963]],["ext.categorySelectFandomDesktop.css","1epqe"],["ext.fandom.Achievements.css","1k7ih"],["ext.fandom.Activity.social.css","jhiop"],["ext.fandom.Activity.summary.css","1tkdf"],["ext.fandom.Activity.tabs.css","16en1"],["ext.fandom.AdminDashboard.fandomdesktop.css","qyujn"],["ext.fandom.AdminDashboard.WikiFeatures.fandomdesktop.css","zp5rn"],["ext.fandom.AdminDashboard.WikiFeatures.fandommobile.css","1cm3s"],["ext.fandom.ae.odyssey.desktop.css","txc0t"],["ext.fandom.ae.odyssey.mobile.css","1xpqb"],["ext.fandom.ae.odyssey.noads.css","1wg8r"],["ext.fandom.announcements.css","18ezz"],["ext.fandom.ArticleComments.css","5f2e1"],["ext.fandom.ArticleInContentPlayer.mobile.css","1qmf6"],["ext.fandom.ArticleInterlang.css","104bi"],["ext.fandom.ArticleVideo.desktop.css","4zcy2"],["ext.fandom.ArticleVideo.mobile.css","1vxaz"],["ext.fandom.Auth.preferences.css","frmhr"],["ext.fandom.bannerNotifications.desktop.css","1hs7o"],["ext.fandom.bannerNotifications.mobile.css","vc083"],["ext.fandom.BaseGlobalComponents.GlobalComponentsTheme.dark.css","22nyz"],["ext.fandom.BaseGlobalComponents.GlobalComponentsTheme.light.css","nl83t"],["ext.fandom.BaseGlobalComponents.GlobalExploreNavigation.css","6makk"],["ext.fandom.BaseGlobalComponents.GlobalFooter.css","s1s7b"],["ext.fandom.BaseGlobalComponents.GlobalNavigationTheme.dark.css","h4g6r"],["ext.fandom.BaseGlobalComponents.GlobalNavigationTheme.default.css","14ykg"],["ext.fandom.BaseGlobalComponents.GlobalNavigationTheme.light.css","hpmdm"],["ext.fandom.BaseGlobalComponents.GlobalTopNavigation.css","1ru64"],["ext.fandom.BaseGlobalComponents.MobileGlobalNavigation.css","1xrpz"],["ext.fandom.BaseLayout.css","10eom"],["ext.fandom.Blogs.css","1pxz6"],["ext.fandom.CategoryPage.category-layout-selector.css","1rfs9"],["ext.fandom.CategoryPage.category-page-mediawiki.css","qjn4k"],["ext.fandom.CategoryPage.category-page3.css","4y72p"],["ext.fandom.CategoryPage.mobile.css","2noie"],["ext.fandom.CloseMyAccount.css","dkq65"],["ext.fandom.communityPage.css","1hygp"],["ext.fandom.ContentReview.css","1toun"],["ext.fandom.ContentReviewDiffToolbar.css","170hq"],["ext.fandom.ContentReviewJsDisabledTooltip.css","1ev54"],["ext.fandom.ContentReviewStatus.css","70ass"],["ext.fandom.ContentReviewWidget.css","1hqe1"],["ext.fandom.CoppaTool.css","1vqi7"],["ext.fandom.CreateNewWiki.css","st03u"],["ext.fandom.CreatePage.css","fdyie"],["ext.fandom.CuratedContentSpecialPage.mobile.css","x01am"],["ext.fandom.CuratedContentSpecialPage.css","siy9e"],["ext.fandom.DiscussionsAbuseFilter.css","4ynty"],["ext.fandom.dismissableSitenotice.css","1bte0"],["ext.fandom.DownloadYourData.css","rgk4j"],["ext.fandom.EditAccount.css","j1v3s"],["ext.fandom.editArea.css","e66j7"],["ext.fandom.EditorTaskBoard.css","1gmpu"],["ext.fandom.Email.SpecialSendEmail.css","noz5l"],["ext.fandom.ExperimentTRFC161.css","f42zy"],["ext.fandom.FandomThanks.thankLink.css","egkid"],["ext.fandom.FandomThanks.thankLinkMobileHistory.css","1s7ep"],["ext.fandom.FandomVisualEditor.mobile.css","1z0ai"],["ext.fandom.FounderProgressBar.fandomdesktop.css","11fyh"],["ext.fandom.FounderProgressBar.css","1d6oz"],["ext.fandom.GlobalComponents.CommunityBar.css","2ywwv"],["ext.fandom.GlobalComponents.CommunityHeader.css","t4qtg"],["ext.fandom.GlobalComponents.CommunityHeaderBackground.css","1ki4h"],["ext.fandom.GlobalComponents.CommunityNavigation.css","1r17a"],["ext.fandom.GlobalComponents.GlobalComponentsTheme.dark.css","20ryf"],["ext.fandom.GlobalComponents.GlobalComponentsTheme.light.css","1g4di"],["ext.fandom.GlobalComponents.GlobalExploreNavigation.css","11tdn"],["ext.fandom.GlobalComponents.GlobalExploreNavigationUxfcp6369.css","pzs8u"],["ext.fandom.GlobalComponents.GlobalFooter.css","qkshu"],["ext.fandom.GlobalComponents.GlobalNavigationTheme.dark.css","124pb"],["ext.fandom.GlobalComponents.GlobalNavigationTheme.default.css","15jh3"],["ext.fandom.GlobalComponents.GlobalNavigationTheme.light.css","1uwgp"],["ext.fandom.GlobalComponents.GlobalTopNavigation.css","gum2k"],["ext.fandom.GlobalComponents.MobileGlobalNavigation.css","6p8bk"],["ext.fandom.GlobalComponents.StickyNavigation.css","1301w"],["ext.fandom.GlobalShortcuts.fandomdesktop.css","1g7pv"],["ext.fandom.GlobalShortcuts.css","oyv00"],["ext.fandom.HighlightToAction.css","a95xv"],["ext.fandom.Insights.css","14ytw"],["ext.fandom.InteractiveMapEditor.css","o7q5f"],["ext.fandom.InteractiveMaps.allmaps.css","13cxg"],["ext.fandom.InteractiveMaps.reports.css","14miy"],["ext.fandom.InteractiveMaps.css","b651e"],["ext.fandom.InteractiveMaps.transcluded.css","2u27n"],["ext.fandom.JWPlayerTag.css","pjxck",[909]],["ext.fandom.Lightbox.InlineVideo.css","24fu1"],["ext.fandom.lightbox.css","ybuh2"],["ext.fandom.ListGlobalUsers.css","omm0u"],["ext.fandom.LookupContribs.css","c32zg"],["ext.fandom.LookupUser.css","6ggrj"],["ext.fandom.mainPageTag.css","1egye"],["ext.fandom.MercuryApi.MobileImageGallery.css","qkxu1"],["ext.fandom.MessageWall.css","19o2w"],["ext.fandom.Migration.css","1angx"],["ext.fandom.MobileImageGallery.Default.css","1q0wn"],["ext.fandom.MobileImageGallery.Navigational.css","y5wsk"],["ext.fandom.MobileImageGallery.css","1mc3p"],["ext.fandom.MultiLookup.css","1q8vp"],["ext.fandom.multiTasks.css","ckzpu"],["ext.fandom.MultiWikiFinder.css","yr636"],["ext.fandom.NaR.gamespotNews.css","y68vh"],["ext.fandom.NewFilesFilters.css","1bkhy"],["ext.fandom.NewInfoboxBuilder.globals.css","1ldz2"],["ext.fandom.Paginator.css","w1m5j"],["ext.fandom.Phalanx.css","1l45o"],["ext.fandom.PhalanxExclusions.css","14b6c"],["ext.fandom.PhalanxStats.css","2rvfs"],["ext.fandom.photoGallery.gallery.css","1kkhz"],["ext.fandom.photoGallery.slider.css","1accu"],["ext.fandom.photoGallery.slideshow.css","9mb4m"],["ext.fandom.PortableInfoboxFandomDesktop.css","16stf"],["ext.fandom.progressTracking.css","56od9"],["ext.fandom.QuickAnswers.css","1sgjw"],["ext.fandom.quickBar.css","qtccy"],["ext.fandom.quickBarUserTools.css","bfik1"],["ext.fandom.ServerSideExperiments.desktopRightRail.css","1c0zk"],["ext.fandom.ServerSideExperiments.imageGalleryWidget.css","1c07y"],["ext.fandom.ServerSideExperiments.mobileHideTlb.css","vy6xp"],["ext.fandom.ServerSideExperiments.mobileMaps.css","1ilme"],["ext.fandom.ServerSideExperiments.splitTrafficReleaseNewNav.css","4x4xd"],["ext.fandom.SitemapPage.css","lg08r"],["ext.fandom.sitenotice.desktop.css","1rvrd"],["ext.fandom.sitenotice.mobile.css","bvgzn"],["ext.fandom.slider.css","rp9mh"],["ext.fandom.SocialLogs.css","14d5k"],["ext.fandom.specialVideos.css","g0jjp"],["ext.fandom.SpecialWidgetPlayground.css","abhuv"],["ext.fandom.SuggestedPages.css","aak8i"],["ext.fandom.TagsReport.css","yx2oa"],["ext.fandom.tcs.dialog.css","xq24p"],["ext.fandom.ThemeDesigner.preview.css","1fgso"],["ext.fandom.ThemeDesignerNext.css","yz1ec"],["ext.fandom.Thumbnails.css","ieydu"],["ext.fandom.ThumbnailsViewImage.css","n3bhw"],["ext.fandom.TwitterTag.css","qrkb4"],["ext.fandom.Uncrawlable.css","q0910"],["ext.fandom.UnifiedSearch.mobile.css","y6te8"],["ext.fandom.UnifiedSearch.css","1xx0m"],["ext.fandom.uploadNewImages.css","1noqt"],["ext.fandom.UserActivity.css","5o4et"],["ext.fandom.UserPreferencesV2.mobile.css","qorx0"],["ext.fandom.UserPreferencesV2.css","th0ap"],["ext.fandom.UserProfile.css","1q1yy"],["ext.fandom.UserProfileActivity.css","1j6jp"],["ext.fandom.UserRenameTool.css","ytxnw"],["ext.fandom.VideoThumbnail.css","479ua"],["ext.fandom.visualEditor.css","1k2j4",[275]],["ext.fandom.visualEditorFandomDesktop.css","dnqhh"],["ext.fandom.WDACReview.css","1iwd8"],["ext.fandom.wikiaBarUserTools.css","iwxab"],["ext.fandom.WikiAnalytics.css","1xme9"],["ext.fandom.WikiConfig.css","1h198"],["ext.fandom.wikiEditor.codeMirrorTheming.css","15pp8"],["ext.fandom.wikiEditor.css","174ur"],["ext.fandom.wikiEditorFandomDesktop.css","xt7yg"],["ext.fandomVideo.css","9x9dd"],["ext.languageWikiIndex.css","1fr4b"],["ext.listUsersPage.css","1gx8b"],["ext.notAValidWiki.css","xbf56"],["ext.portableInfobox.mobile.css","133r2"],["ext.staffSig.css","bjm8u"],["ext.tabView.css","1oajc"],["ext.wikiConfigPage.css","ipqfv"],["jwplayer-fandom.css","1pw8r"],["skin.common.mobileDiff.css","i0c06"],["skin.fandomdesktop.AbuseFilter.css","17cus"],["skin.fandomdesktop.ActionHistory.css","kw8vs"],["skin.fandomdesktop.ApiSandbox.css","1c61f"],["skin.fandomdesktop.CargoQuery.css","vv3fi"],["skin.fandomdesktop.CargoTables-ext.css","nj8rj"],["skin.fandomdesktop.CargoTables.css","17q2i"],["skin.fandomdesktop.CategoryTree.css","1d6tu"],["skin.fandomdesktop.CheckUser.css","155v3"],["skin.fandomdesktop.Community.css","4xvj8"],["skin.fandomdesktop.contributions.css","1bq8r"],["skin.fandomdesktop.Drilldown.css","vme0b"],["skin.fandomdesktop.editcount.css","oz10p"],["skin.fandomdesktop.FilePage.css","11mtq"],["skin.fandomdesktop.FlaggedRevs.css","1tr4t"],["skin.fandomdesktop.font.BioRhyme.css","sixba"],["skin.fandomdesktop.font.InknutAntiqua.css","12zeq"],["skin.fandomdesktop.font.Lora.css","c6psu"],["skin.fandomdesktop.font.RobotoSlab.css","r5bw7"],["skin.fandomdesktop.font.WorkSans.css","1ta8b"],["skin.fandomdesktop.Gadgets.css","1dlik"],["skin.fandomdesktop.InterwikiEdit.css","oh7bg"],["skin.fandomdesktop.Math.css","1ixnj"],["skin.fandomdesktop.MathStatus.css","n4r5i"],["skin.fandomdesktop.NewPages.css","5mk92"],["skin.fandomdesktop.Popups.css","1ndwl"],["skin.fandomdesktop.pygments.css","th2zs"],["skin.fandomdesktop.rail.recentActivity.css","13wgy"],["skin.fandomdesktop.rail.css","hutwv"],["skin.fandomdesktop.RecentChanges.css","1wack"],["skin.fandomdesktop.RecentChangesLinked.css","ey4q0"],["skin.fandomdesktop.css","f3rsk"],["skin.fandomdesktop.SpecialInvestigate.css","1laav"],["skin.fandomdesktop.SpecialPageGlobal.css","ifgj5"],["skin.fandomdesktop.SpecialPagesLists.css","94hbb"],["skin.fandomdesktop.Statistics.css","1emfr"],["skin.fandomdesktop.Upload.css","b2df6"],["skin.fandomdesktop.Watchlist.css","1bzuj"],["skin.fandommobile.ActionHistory.css","1gvmu"],["skin.fandommobile.ApiSandbox.css","j567o"],["skin.fandommobile.Contributions.css","xpna4"],["skin.fandommobile.fandom.dark.css","pngtk"],["skin.fandommobile.fandom.light.css","nn1sp"],["skin.fandommobile.ListFiles.css","17qib"],["skin.fandommobile.mobileDrawer.css","hwfsz"],["skin.fandommobile.mobileMainPage.css","j1cmg"],["skin.fandommobile.notifications.css","15ois"],["skin.fandommobile.notificationsAnon.css","z5bhh"],["skin.fandommobile.RecentChanges.css","h4m6j"],["skin.fandommobile.RecentChangesLinked.css","18ju4"],["skin.fandommobile.css","qax13"],["skin.fandommobile.SpecialPagesLists.css","13imi"],["skin.fandommobile.VisualEditor.css","19esq"],["vendor.tippy.css","1tw4t"],["ext.fandom.AgeGate.messages","noad5"],["ext.categorySelect.messages","1o319"],["ext.fandom.Auth.preferences.messages","udhui"],["ext.fandom.bannerNotifications.messages","5m0z6"],["ext.fandom.ListGlobalUsers.messages","xghki"],["ext.fandom.wikiaBar.messages","127x2"],["ext.curatedContent.messages","1wtbn"],["ext.listUsers","b5vgf",[36]],["ext.fandom.ContentReviewTestModeMessages","4a4da"],["ext.fandom.UnifiedSearch.js","cfjpj",[38]],["ext.fandom.wikianalytics.legendtranslations","1i3q9"],["ext.fandom.UserProfile.messages","r5df4"],["ext.fandom.GlobalComponents.GlobalExploreNavigation.messages","cvj5i"],["ext.fandom.GlobalComponents.GlobalTopNavigation.messages","aqcjx"],["ext.fandom.GlobalComponents.Notifications.messages","1gbt0"],["ext.fandom.GlobalComponents.SearchModal.messages","1iz7r"],["ext.fandom.Thumbnails.messages","flqql"],["ext.fandom.Experiments.TRFC25","y54m7"],["ext.fandom.Experiments.TRFC147","j1u1a"],["ext.abuseFilter","1xq3l"],["ext.abuseFilter.edit","4qihj",[19,24,40,199]],["ext.abuseFilter.tools","15c6u",[19,38]],["ext.abuseFilter.examine","1ql8i",[19,38]],["ext.abuseFilter.ace","1bujn",[996]],["ext.abuseFilter.visualEditor","1r9cz"],["ext.fandom.photoGallery.messages","19txf"],["ext.fandom.ArticleComments.messages","1fjv9"],["ext.fandom.Blogs.messages","1jwt9"],["ext.codeEditor","1p6ue",[994],5],["ext.codeEditor.styles","wrsbq"],["jquery.codeEditor","6nliv",[996,995,348,204],5],["ext.codeEditor.icons","1fpe8"],["ext.codeEditor.ace","1t4yn",[],6],["ext.codeEditor.ace.modes","tvmlr",[996],6],["ext.CodeMirror","1gnh6",[73]],["ext.CodeMirror.WikiEditor","rhq8y",[998,24,215]],["ext.CodeMirror.lib","1bd9x"],["ext.CodeMirror.addons","19bks",[1000]],["ext.CodeMirror.mode.mediawiki","3q7f0",[1000]],["ext.CodeMirror.lib.mode.css","1kqvv",[1000]],["ext.CodeMirror.lib.mode.javascript","1r235",[1000]],["ext.CodeMirror.lib.mode.xml","1siba",[1000]],["ext.CodeMirror.lib.mode.htmlmixed","f433m",[1003,1004,1005]],["ext.CodeMirror.lib.mode.clike","147xq",[1000]],["ext.CodeMirror.lib.mode.php","uvn3j",[1007,1006]],["ext.CodeMirror.visualEditor","19bqb",[998,307]],["ext.CodeMirror.v6","1ajd0",[1012,73]],["ext.CodeMirror.v6.init","1vgvo",[1013]],["ext.CodeMirror.v6.lib","jxegq"],["ext.CodeMirror.v6.mode.mediawiki","11gm5",[1010]],["ext.CodeMirror.v6.WikiEditor","1t9hg",[348]],["ext.CodeMirror.v6.WikiEditor.init","gdhe7",[1014,1013]],["ext.CodeMirror.v6.visualEditor","1swvm",[1010,307]],["ext.CodeMirror.visualEditor.init","1530c"],["ext.templateData","15a30"],["ext.templateDataGenerator.editPage","8oiwy"],["ext.templateDataGenerator.data","1rrr9",[193]],["ext.templateDataGenerator.editTemplatePage.loading","1fb90"],["ext.templateDataGenerator.editTemplatePage","19zuz",[1018,1023,1020,24,1063,73,199,204,216,217,220]],["ext.templateData.images","1y50h"],["ext.nuke.confirm","38myg",[101]],["ext.nuke.styles","oasli"],["skin.fandomdesktop.styles","416dl"],["skin.fandomdesktop.messages","1vttz"],["skin.fandomdesktop.Bagdes.messages","1jotx"],["mobile.pagelist.styles","r75gz"],["mobile.pagesummary.styles","1ry0o"],["mobile.userpage.styles","1j0zy"],["mobile.init.styles","199fk"],["mobile.init","1wyaw",[1035]],["mobile.codex.styles","a6fbd"],["mobile.startup","1l153",[110,194,64,36,1034,1032,1029,1030]],["mobile.editor.overlay","1hfuu",[92,40,80,168,1035,195,212]],["mobile.mediaViewer","z7ugi",[1035]],["mobile.languages.structured","1ix73",[1035]],["mobile.special.styles","ps8f2"],["mobile.special.watchlist.scripts","184mt",[1035]],["mobile.special.codex.styles","1tpzh"],["mobile.special.mobileoptions.styles","1pevd"],["mobile.special.mobileoptions.scripts","cwin1",[1035]],["mobile.special.userlogin.scripts","1cism"],["ext.reverb.notifications.styles","19t8s"],["ext.reverb.notifications.scripts","1vp4q",[38]],["ext.reverb.notifications.scripts.notificationPage","1eizu"],["ext.reverb.notifications.styles.notificationPage","1ry26"],["ext.reverb.specialNotifications.fandomdesktop.styles","z406s"],["ext.reverb.preferences","1kk9x"],["ext.twiggy","3mi46",[38]],["ext.embedVideo","g5b4k"],["ext.embedVideo-evl","rqy8v",[1052,38]],["ext.embedVideo.styles","1gam1"],["ext.timeline.styles","1osj7"],["ext.fandom.HighlightToAction.messages","1f81d"],["ext.fandom.DiscussionsAbuseFilter.messages","15p3g"],["ext.thanks","w18d6",[38,78]],["ext.thanks.corethank","10qel",[1058,14,204]],["ext.thanks.flowthank","93ljv",[1058,204]],["ext.pygments.view","b9hdx",[65]],["ext.confirmEdit.CaptchaInputWidget","kmrqr",[196]],["jquery.uls.data","335cz"],["ext.fandom.globalCSSJS.user.styles","1qi5o",[],1],["ext.fandom.globalCSSJS.user","1qi5o",[376],1],["ext.fandom.site","6tukb",[1,376],7],["ext.fandom.site.test","6tukb",[1,376],7],["ext.fandom.ImportJs.test","1yf7h",[376],7],["ext.fandom.ImportJs","1yf7h",[376],7],["mediawiki.messagePoster","41hnc",[47]]]);
		// First set page-specific config needed by mw.loader (wgUserName)
		mw.config.set( window.RLCONF || {} );
		mw.loader.state( window.RLSTATE || {} );
		mw.loader.load( window.RLPAGEMODULES || [] );

		// Process RLQ callbacks
		//
		// The code in these callbacks could've been exposed from load.php and
		// requested client-side. Instead, they are pushed by the server directly
		// (from ResourceLoaderClientHtml and other parts of MediaWiki). This
		// saves the need for additional round trips. It also allows load.php
		// to remain stateless and sending personal data in the HTML instead.
		//
		// The HTML inline script lazy-defines the 'RLQ' array. Now that we are
		// processing it, replace it with an implementation where 'push' actually
		// considers executing the code directly. This is to ensure any late
		// arrivals will also be processed. Late arrival can happen because
		// startup.js is executed asynchronously, concurrently with the streaming
		// response of the HTML.
		queue = window.RLQ || [];
		// Replace RLQ with an empty array, then process the things that were
		// in RLQ previously. We have to do this to avoid an infinite loop:
		// non-function items are added back to RLQ by the processing step.
		RLQ = [];
		RLQ.push = function ( fn ) {
			if ( typeof fn === 'function' ) {
				fn();
			} else {
				// If the first parameter is not a function, then it is an array
				// containing a list of required module names and a function.
				// Do an actual push for now, as this signature is handled
				// later by mediawiki.base.js.
				RLQ[ RLQ.length ] = fn;
			}
		};
		while ( queue[ 0 ] ) {
			// Process all values gathered so far
			RLQ.push( queue.shift() );
		}

		// Clear and disable the basic (Grade C) queue.
		NORLQ = {
			push: function () {}
		};
	}() );
}
