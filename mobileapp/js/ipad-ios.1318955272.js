/*!
 * Joshfire Framework 0.9.1
 * http://framework.joshfire.com/
 *
 * Copyright 2011, Joshfire
 * Dual licensed under the GPL Version 2 and a Commercial license.
 * http://framework.joshfire.com/license
 *
 * Date: Wed Jul 20 20:23:43 2011
 */

(function() {
  var J;

  /**
  * @namespace The Joshfire namespace. The only global variable the framework should expose.
  * @name Joshfire
  */
  J = {
    /**
    * @lends Joshfire
    */

    /**
    * The version of Joshfire
    * @type {Array}
    */
    version: [0, 9, 1],

    /**
    * DOM Ready util
    * @function
    * @param {Function} callback when finished.
    */
    onReady: function(callback) {
      callback();
    },

    /**
    * The current adapter. Gets automatically populated by the <code>bootstraps</code>
    * or <code>optimize</code> <a href="/doc/develop/buildtools">build commands</a>
    * @type {String}
    */
    adapter: 'ios',

    /**
    * List of modules supported by the current adapter and its dependencies. Gets automatically populated
    * by the <code>bootstraps</code> or <code>optimize</code> <a href="/doc/develop/buildtools">build commands</a>
    * @type {Object}
    */
    adapterModules: {"ios": ["app", "uielement", "inputs/touch", "uielements/list", "uielements/mediacontrols", "uielements/video.mediaelement", "uielements/video.youtube", "utils/datasource"]},

    /**
    * List of adapters the current adapter depends on
    * @type {Array}
    */
    adapterDeps: [],

    /**
    * Debug mode. Will console.log all events
    * @type {boolean}
    */
    debug: false,


    basePath: 'joshfire/',

    requirePath: ''

  };

  // 'joshfire/uielements/list' => '[J.basePath]/adapters/DEVICE/uielements/list'
  var addAdapterToDeps = function(deps) {
    var src;

    //Lookup order is adapter, then its dependencies
    var adaptersLookup = [J.adapter].concat(J.adapterDeps);

    for (var i = 0, l = deps.length; i < l; i++) {

      //replace {adapter} by the current adapter
      deps[i] = deps[i].replace(/\{adapter\}/g, J.adapter);


      var noadapter = /^noadapter\!/.test(deps[i]);
      if (noadapter) {
        deps[i] = deps[i].substring(10);
      }



      if (/^joshfire\//.test(deps[i])) {

        var moduleName = deps[i].substring(9);

        deps[i] = J.basePath + moduleName;

        for (var ii = 0, ll = adaptersLookup.length; ii < ll && !noadapter; ii++) {
          var bFound = false;
          // If the adapter provides an implementation of this class, load it instead
          for (var iii = 0, iLength = J.adapterModules[adaptersLookup[ii]].length; iii < iLength; iii++) {
            if (J.adapterModules[adaptersLookup[ii]][iii] === moduleName) {
              deps[i] = deps[i].replace(moduleName, 'adapters/' + adaptersLookup[ii] + '/' + moduleName);
              bFound = true;
              break;
            }
          }
          if (bFound === true)
            break;
        }

      } else {
        deps[i] = J.requirePath + deps[i];
      }


    }

    return deps;
  };

  /**
  * Defines a module
  * @function
  * @param {Array} deps List of dependencies.
  * @param {Function} callback Callback when all the dependencies are loaded. Takes as arguments the list of loaded modules.
  * @name Joshfire.define
  */
  J.define = function(deps, callback) {
    define(addAdapterToDeps(deps), callback);
  };

  /**
  * Requires a list of modules
  * @function
  * @param {Array} deps List of modules to load.
  * @param {Function} callback Callback when all the modules are loaded. Takes as arguments the list of loaded modules.
  * @name Joshfire.require
  */
  J.require = function(deps, callback) {

    var requireOptions = {
      //"baseUrl":J.requirePath,
      /*"packages": [
      {
      "name":"joshfire",
      "location":J.basePath,
      "lib":"."
      }
      ]*/
    };

    if (J.debug && J.adapter != 'node') {
      requireOptions['urlArgs'] = 'bust=' + (new Date()).getTime();
    }

    require(requireOptions, addAdapterToDeps(deps), callback);
  };

  // Attach to global scope on browsers
  this.Joshfire = J;

  // Attach the namespace to the global scope or for nodeJS
  if (typeof module !== 'undefined' && module.exports) {
    module.exports.Joshfire = J;
  }
})();
/*!
 * Joshfire Framework 0.9.1
 * http://framework.joshfire.com/
 *
 * Copyright 2011, Joshfire
 * Dual licensed under the GPL Version 2 and a Commercial license.
 * http://framework.joshfire.com/license
 *
 * Date: Wed Jul 20 20:23:43 2011
 */

(function(J) {

  //todo !joshfire
  J.onReady = function(f) {
    J.require(['joshfire/vendor/zepto'], function($) {
      //      $(f);
      f.call();
    });
  };


})(Joshfire);
Joshfire.definedModules = {}; Joshfire.loadedModules = {};Joshfire.loadModule = function(m) { if (!Joshfire.loadedModules[m]) {  Joshfire.loadedModules[m]=Joshfire.definedModules[m]();  Joshfire.definedModules[m]=true; } return Joshfire.loadedModules[m];};Joshfire.compiled = 1318955250556;var require = function(opts,deps,func) { if (opts.length) { func=deps;deps=opts; } var objs = []; if(typeof deps === 'string') deps = [deps]; for (var i=0;i<deps.length;i++) {  if(!Joshfire.definedModules[deps[i]])  deps[i] = 'joshfire/'+deps[i];  if(!Joshfire.definedModules[deps[i]])  throw new Error(deps[i]+' was not included, please reference it in build.js');  objs.push(Joshfire.loadModule(deps[i])); };  func.apply(this,objs); };

Joshfire.definedModules['joshfire/vendor/underscore'] = function() { return (
function () {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var slice            = ArrayProto.slice,
      unshift          = ArrayProto.unshift,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) { return new wrapper(obj); };

  // Export the Underscore object for **CommonJS**, with backwards-compatibility
  // for the old `require()` API. If we're not in CommonJS, add `_` to the
  // global object.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = _;
    _._ = _;
  } else {
    // Exported as a string, for Closure Compiler "advanced" mode.
    root['_'] = _;
  }

  // Current version.
  _.VERSION = '1.2.0';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = memo !== void 0;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError("Reduce of empty array with no initial value");
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return memo !== void 0 ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var reversed = (_.isArray(obj) ? obj.slice() : _.toArray(obj)).reverse();
    return _.reduce(reversed, iterator, memo, context);
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    each(obj, function(value, index, list) {
      if (!iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator = iterator || _.identity;
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result |= iterator.call(context, value, index, list)) return breaker;
    });
    return !!result;
  };

  // Determine if a given value is included in the array or object using `===`.
  // Aliased as `contains`.
  _.include = _.contains = function(obj, target) {
    var found = false;
    if (obj == null) return found;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    any(obj, function(value) {
      if (found = value === target) return true;
    });
    return found;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    return _.map(obj, function(value) {
      return (method.call ? method || value : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Return the maximum element or (element-based computation).
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.max.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.min.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var shuffled = [], rand;
    each(obj, function(value, index, list) {
      if (index == 0) {
        shuffled[0] = value;
      } else {
        rand = Math.floor(Math.random() * (index + 1));
        shuffled[index] = shuffled[rand];
        shuffled[rand] = value;
      }
    });
    return shuffled;
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }), 'value');
  };

  // Groups the object's values by a criterion produced by an iterator
  _.groupBy = function(obj, iterator) {
    var result = {};
    each(obj, function(value, index) {
      var key = iterator(value, index);
      (result[key] || (result[key] = [])).push(value);
    });
    return result;
  };

  // Use a comparator function to figure out at what index an object should
  // be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator) {
    iterator || (iterator = _.identity);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(iterable) {
    if (!iterable)                return [];
    if (iterable.toArray)         return iterable.toArray();
    if (_.isArray(iterable))      return slice.call(iterable);
    if (_.isArguments(iterable))  return slice.call(iterable);
    return _.values(iterable);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    return _.toArray(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head`. The **guard** check allows it to work
  // with `_.map`.
  _.first = _.head = function(array, n, guard) {
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especcialy useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    return (n != null) && !guard ? slice.call(array, array.length - n) : array[array.length - 1];
  };

  // Returns everything but the first entry of the array. Aliased as `tail`.
  // Especially useful on the arguments object. Passing an **index** will return
  // the rest of the values in the array from that index onward. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = function(array, index, guard) {
    return slice.call(array, (index == null) || guard ? 1 : index);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, function(value){ return !!value; });
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array) {
    return _.reduce(array, function(memo, value) {
      if (_.isArray(value)) return memo.concat(_.flatten(value));
      memo[memo.length] = value;
      return memo;
    }, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator) {
    var initial = iterator ? _.map(array, iterator) : array;
    var result = [];
    _.reduce(initial, function(memo, el, i) {
      if (0 == i || (isSorted === true ? _.last(memo) != el : !_.include(memo, el))) {
        memo[memo.length] = el;
        result[result.length] = array[i];
      }
      return memo;
    }, []);
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays. (Aliased as "intersect" for back-compat.)
  _.intersection = _.intersect = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and another.
  // Only the elements present in just the first array will remain.
  _.difference = function(array, other) {
    return _.filter(array, function(value){ return !_.include(other, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) results[i] = _.pluck(args, "" + i);
    return results;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i, l;
    if (isSorted) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
    for (i = 0, l = array.length; i < l; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item) {
    if (array == null) return -1;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Binding with arguments is also known as `curry`.
  // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
  // We check for `func.bind` first, to fail fast when `func` is undefined.
  _.bind = function(func, obj) {
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    var args = slice.call(arguments, 2);
    return function() {
      return func.apply(obj, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length == 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return hasOwnProperty.call(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(func, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Internal function used to implement `_.throttle` and `_.debounce`.
  var limit = function(func, wait, debounce) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var throttler = function() {
        timeout = null;
        func.apply(context, args);
      };
      if (debounce) clearTimeout(timeout);
      if (debounce || !timeout) timeout = setTimeout(throttler, wait);
    };
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    return limit(func, wait, false);
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds.
  _.debounce = function(func, wait) {
    return limit(func, wait, true);
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      return memo = func.apply(this, arguments);
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func].concat(slice.call(arguments));
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = slice.call(arguments);
    return function() {
      var args = slice.call(arguments);
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) { return func.apply(this, arguments); }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (hasOwnProperty.call(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    return _.map(obj, _.identity);
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (source[prop] !== void 0) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (obj[prop] == null) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function.
  function eq(a, b, stack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null) return a === b;
    // Compare object types.
    var typeA = typeof a;
    if (typeA != typeof b) return false;
    // Optimization; ensure that both values are truthy or falsy.
    if (!a != !b) return false;
    // `NaN` values are equal.
    if (_.isNaN(a)) return _.isNaN(b);
    // Compare string objects by value.
    var isStringA = _.isString(a), isStringB = _.isString(b);
    if (isStringA || isStringB) return isStringA && isStringB && String(a) == String(b);
    // Compare number objects by value.
    var isNumberA = _.isNumber(a), isNumberB = _.isNumber(b);
    if (isNumberA || isNumberB) return isNumberA && isNumberB && +a == +b;
    // Compare boolean objects by value. The value of `true` is 1; the value of `false` is 0.
    var isBooleanA = _.isBoolean(a), isBooleanB = _.isBoolean(b);
    if (isBooleanA || isBooleanB) return isBooleanA && isBooleanB && +a == +b;
    // Compare dates by their millisecond values.
    var isDateA = _.isDate(a), isDateB = _.isDate(b);
    if (isDateA || isDateB) return isDateA && isDateB && a.getTime() == b.getTime();
    // Compare RegExps by their source patterns and flags.
    var isRegExpA = _.isRegExp(a), isRegExpB = _.isRegExp(b);
    if (isRegExpA || isRegExpB) {
      // Ensure commutative equality for RegExps.
      return isRegExpA && isRegExpB &&
             a.source == b.source &&
             a.global == b.global &&
             a.multiline == b.multiline &&
             a.ignoreCase == b.ignoreCase;
    }
    // Ensure that both values are objects.
    if (typeA != 'object') return false;
    // Unwrap any wrapped objects.
    if (a._chain) a = a._wrapped;
    if (b._chain) b = b._wrapped;
    // Invoke a custom `isEqual` method if one is provided.
    if (_.isFunction(a.isEqual)) return a.isEqual(b);
    // Assume equality for cyclic structures. The algorithm for detecting cyclic structures is
    // adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = stack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of unique nested
      // structures.
      if (stack[length] == a) return true;
    }
    // Add the first object to the stack of traversed objects.
    stack.push(a);
    var size = 0, result = true;
    if (a.length === +a.length || b.length === +b.length) {
      // Compare object lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare array-like object contents, ignoring non-numeric properties.
        while (size--) {
          // Ensure commutative equality for sparse arrays.
          if (!(result = size in a == size in b && eq(a[size], b[size], stack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (hasOwnProperty.call(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = hasOwnProperty.call(b, key) && eq(a[key], b[key], stack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (hasOwnProperty.call(b, key) && !size--) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    stack.pop();
    return result;
  }

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, []);
  };

  // Is a given array or object empty?
  _.isEmpty = function(obj) {
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (hasOwnProperty.call(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType == 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Is a given variable an arguments object?
  _.isArguments = function(obj) {
    return !!(obj && hasOwnProperty.call(obj, 'callee'));
  };

  // Is a given value a function?
  _.isFunction = function(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  };

  // Is a given value a string?
  _.isString = function(obj) {
    return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
  };

  // Is a given value a number?
  _.isNumber = function(obj) {
    return !!(obj === 0 || (obj && obj.toExponential && obj.toFixed));
  };

  // Is the given value `NaN`? `NaN` happens to be the only value in JavaScript
  // that does not equal itself.
  _.isNaN = function(obj) {
    return obj !== obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value a date?
  _.isDate = function(obj) {
    return !!(obj && obj.getTimezoneOffset && obj.setUTCFullYear);
  };

  // Is the given value a regular expression?
  _.isRegExp = function(obj) {
    return !!(obj && obj.test && obj.exec && (obj.ignoreCase || obj.ignoreCase === false));
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function (n, iterator, context) {
    for (var i = 0; i < n; i++) iterator.call(context, i);
  };

  // Escape a string for HTML interpolation.
  _.escape = function(string) {
    return (''+string).replace(/&(?!\w+;|#\d+;|#x[\da-f]+;)/gi, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;');
  };

  // Add your own custom functions to the Underscore object, ensuring that
  // they're correctly added to the OOP wrapper as well.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      addToWrapper(name, _[name] = obj[name]);
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(str, data) {
    var c  = _.templateSettings;
    var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
      'with(obj||{}){__p.push(\'' +
      str.replace(/\\/g, '\\\\')
         .replace(/'/g, "\\'")
         .replace(c.escape, function(match, code) {
           return "',_.escape(" + code.replace(/\\'/g, "'") + "),'";
         })
         .replace(c.interpolate, function(match, code) {
           return "'," + code.replace(/\\'/g, "'") + ",'";
         })
         .replace(c.evaluate || null, function(match, code) {
           return "');" + code.replace(/\\'/g, "'")
                              .replace(/[\r\n\t]/g, ' ') + "__p.push('";
         })
         .replace(/\r/g, '\\r')
         .replace(/\n/g, '\\n')
         .replace(/\t/g, '\\t')
         + "');}return __p.join('');";
    var func = new Function('obj', tmpl);
    return data ? func(data) : func;
  };

  // The OOP Wrapper
  // ---------------

  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.
  var wrapper = function(obj) { this._wrapped = obj; };

  // Expose `wrapper.prototype` as `_.prototype`
  _.prototype = wrapper.prototype;

  // Helper function to continue chaining intermediate results.
  var result = function(obj, chain) {
    return chain ? _(obj).chain() : obj;
  };

  // A method to easily add functions to the OOP wrapper.
  var addToWrapper = function(name, func) {
    wrapper.prototype[name] = function() {
      var args = slice.call(arguments);
      unshift.call(args, this._wrapped);
      return result(func.apply(_, args), this._chain);
    };
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      method.apply(this._wrapped, arguments);
      return result(this._wrapped, this._chain);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      return result(method.apply(this._wrapped, arguments), this._chain);
    };
  });

  // Start chaining a wrapped Underscore object.
  wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  // Extracts the result from a wrapped and chained object.
  wrapper.prototype.value = function() {
    return this._wrapped;
  };
  
  return _;

}
)();
 };

Joshfire.definedModules['joshfire/class'] = function() { return (
function(_) {

  var initializing = false,
      fnTest = /xyz/.test(function() {
            xyz;
      }) ? (/\b__super\b/) : /.*/;

  var Class = function() {};


  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == 'function' && typeof _super[name] == 'function' && fnTest.test(prop[name]) ? (function(name, fn) {
        return function() {
          var tmp = this.__super;

          // Add a new ._super() method that is the same method
          // but on the super-class
          this.__super = _super[name];

          // The method only need to be bound temporarily, so we
          // remove it when we're done executing
          var ret = fn.apply(this, arguments);
          this.__super = tmp;

          return ret;
        };
      })(name, prop[name]) : prop[name];
    }


    function Class() {
      // All construction is actually done in the init method
      if (!initializing && this.__constructor) this.__constructor.apply(this, arguments);
    }

    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    Class.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;

    return Class;
  };

  return function() {
    if (_.isFunction(arguments[0])) {
      return arguments[0].extend(arguments[1]);
    } else {
      return Class.extend(arguments[0]);
    }
  };
}
)(Joshfire.loadModule('joshfire/vendor/underscore'));
 };

Joshfire.definedModules['joshfire/main'] = function() { return (
function() {
  return Joshfire;
}
)();
 };

Joshfire.definedModules['joshfire/mixins/pubsub'] = function() { return (
function(J) {

  /**
  * @class Publish-Subscribe mixin
  * @name mixins_pubsub
  */
  return {
    mixin: function(target) {


      target.__pubsubSubscribes = false;

      target.__pubsubLastUid = -1;


      /*https://github.com/mroderick/PubSubJS/blob/master/pubsub.js*/
      
      /**
      * Send an event. Publishes the the message, passing the data to its subscribers
      * @methodOf mixins_pubsub#
      * @name publish
      * @param {String} message The message to publish.
      * @param data The data to pass to subscribers.
      * @param {Boolean} sync Forces publication to be syncronous, which is more confusing, but faster.
      */
      target.publish = function(message, data, sync) {

        if (J.debug && message != 'timeupdate') {
          console.log('publish', this.id, message, data, sync);
        }

        // if there are no subscribers to this message, just return here
        if (!this.__pubsubSubscribes.hasOwnProperty(message) && !this.__pubsubSubscribes.hasOwnProperty('*')) {
          return false;
        }
        var self = this;
        var deliverMessage = function() {
          var subscribers = (self.__pubsubSubscribes[message] || []).concat(self.__pubsubSubscribes['*'] || []);
          var throwException = function(e) {
            return function() {
              throw e;
            };
          };

          for (var i = 0, j = subscribers.length; i < j; i++) {

            //try {
            //console.log(message,data,subscribers.length,i,subscribers[i]);
            if (subscribers[i]) subscribers[i].func(message, data, subscribers[i].token);
            //} catch( e ){
            //    setTimeout( throwException(e), 0);
            //}
          }
        };

        if (sync === true) {
          deliverMessage();
        } else {
          setTimeout(deliverMessage, 0);
        }
        return true;
      };


      /**
      * Subscribes the passed function to the passed message. Every returned token is unique and should be stored if you need to unsubscribe
      * @methodOf mixins_pubsub#
      * @name subscribe
      * @param {String} message The message to subscribe to.
      * @param {Function} func The function to call when a new message is published.
      * @return {String} token for unsubscribing.
      **/
      target.subscribe = function(message, func) {

        if (this.__pubsubSubscribes === false) {
          this.__pubsubSubscribes = {};
        }

        // message is not registered yet
        if (!this.__pubsubSubscribes.hasOwnProperty(message)) {
          this.__pubsubSubscribes[message] = [];
        }

        // forcing token as String, to allow for future expansions without breaking usage
        // and allow for easy use as key names for the 'this.__pubsubSubscribes' object
        var token = (++this.__pubsubLastUid).toString();
        this.__pubsubSubscribes[message].push({
          token: token,
          func: func
        });

        // return token for unsubscribing
        return token;
      };


      /**
      * Unsubscribes a specific subscriber from a specific message using the unique token
      * @name unsubscribe
      * @methodOf mixins_pubsub#
      * @param {String} token The token of the function to unsubscribe.
      **/
      target.unsubscribe = function(token) {
        for (var m in this.__pubsubSubscribes) {
          if (this.__pubsubSubscribes.hasOwnProperty(m)) {
            for (var i = 0, j = this.__pubsubSubscribes[m].length; i < j; i++) {
              if (this.__pubsubSubscribes[m][i].token === token) {
                this.__pubsubSubscribes[m].splice(i, 1);
                return token;
              }
            }
          }
        }
        return false;
      };

    }
  };

}
)(Joshfire.loadModule('joshfire/main'));
 };

Joshfire.definedModules['joshfire/mixins/state'] = function() { return (
function(_) {


  /**
  * @class State storage and events mixin
  * @name mixins_state
  */
  return {
    mixin: function(target) {

      /**
      * Sets a state
      * @methodOf mixins_state#
      * @name setState
      * @param {string} register
      * @param {var} state
      **/
      target.setState = function(register, state) {
        if (!this.__stateStore) this.__stateStore = {};

        if (!_.isEqual(this.__stateStore[register], state)) {
          this.__stateStore[register] = state;
          this.publish('state', [register, state], true);
        }
      };

      /**
      * Set hash of states and send events only after
      * @methodOf mixins_state#
      * @name setStates
      * @param {Object} states Hash of states.
      **/
      target.setStates = function(states) {
        if (!this.__stateStore) this.__stateStore = {};

        var self = this;

        var events = [];

        _.each(states, function(state, register) {
          if (!_.isEqual(self.__stateStore[register], state)) {
            self.__stateStore[register] = state;
            events.push([register, state]);
          }
        });

        _.each(events, function(ev) {
          self.publish('state', ev, true);
        });
      };

      /**
      * Deletes a state
      * @methodOf mixins_state#
      * @name deleteState
      * @param {string}
      **/
      target.deleteState = function(register) {
        if (!this.__stateStore) this.__stateStore = {};
        delete this.__stateStore[register];
      };

      /**
      * Listens to a state or fire immediately if already in this state. target must have the pubsub mixin.
      * @methodOf mixins_state#
      * @name onState
      * @param {string}
      **/
      target.onState = function(register,value,callback) {
        if (this.getState(register) == value) {
          callback();
        }
        this.subscribe('state', function(ev,data) {
          if (data[0] == register && data[1] == value) {
            callback();
          }
        });
      };

      /**
      * Returns a state
      * @methodOf mixins_state#
      * @name getState
      * @param {string} register
      **/
      target.getState = function(register) {
        if (!this.__stateStore) this.__stateStore = {};
        if (!register) {
          return this.__stateStore;
        }
        return this.__stateStore[register];
      };
    }
  };

}
)(Joshfire.loadModule('joshfire/vendor/underscore'));
 };

Joshfire.definedModules['joshfire/vendor/json2'] = function() { return (
function() {

/*
    http://www.JSON.org/json2.js
    2011-02-23

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false, regexp: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

//var JSON;
if (!window.JSON) {
    window.JSON = {};
}

(function () {
    "use strict";

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                this.getUTCFullYear()     + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())      + 'T' +
                f(this.getUTCHours())     + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' : gap ?
                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

window.JSON = JSON;
return JSON;

}
)();
 };

Joshfire.definedModules['joshfire/tree'] = function() { return (
function(J, Class, PubSub, State, _, JSON) {


  var Tree = Class(
      /**
      * @lends tree.prototype
      */
      {
        allowRootAccess: false,

        inverses: {
          'down': 'up',
          'up': 'down',
          'next': 'prev',
          'prev': 'next'
        },

        /**
        * @constructs
        * @borrows mixins_pubsub#publish as #publish
        * @borrows mixins_pubsub#subscribe as #subscribe
        * @borrows mixins_pubsub#unsubscribe as #unsubscribe
        * @borrows mixins_state#setState as #setState
        * @borrows mixins_state#setStates as #setStates
        * @borrows mixins_state#getState as #getState
        * @borrows mixins_state#onState as #onState
        * @borrows mixins_state#deleteState as #deleteState
        * @class Tree structure base class
        * @param {app} app Reference to the app object.
        * @param {string} id ID for the tree.
        * @param {Object} options Options object.
        */
        __constructor: function(app, id, options) {

          this.app = app;

          this.options = _.extend({
            'defaultQuery': {
              'limit': 20,
              'skip': 0
            }
          },options || {});

          this.id = id;

          this.id2index = {};

          this.beingLoaded = {};

          this.stateChangeSerial = 1;

          this.tree = {};

          this.childrenFunctions = {};

          this.queryCache = {};

          this.itemCache = {};

          this.init();

        },

        init: function() {

        },

        /**
        * Performs setup
        * @methodOf tree.prototype
        * @param {Function} callback when finished.
        */
        setup: function(callback) {
          if (this.options.tree) {
            this.set('/', this.options.tree, callback);
          } else {
            this.set('/', this.buildTree ? this.buildTree() : [], callback);
          }
        },

        /**
        * Moves a register to a path
        * @methodOf tree.prototype
        * @param {string} register Name of the register.
        * @param {string} path Path to store in the register.
        * @param {Object} query Query for the last "down" move if needed.
        */
        //absolute
        moveTo: function(register, path, query) {
          var self = this;
          if (!path) return;
          //Go to first child
          if (self.isDirectory(path)) {
	        var async = true;
            self.resolveMoves(path.substring(0, path.length - 1), ['down'], query, function(err, newPath) {
	          //console.log("FChild callback got "+newPath,newPath);
              async = false;
              self.setState(register, newPath);
            });
		  //Set the temporary register
            if (async) {
              //console.log("FChild callback was async, setting "+path,path);
              self.setState(register, path);
            }
          } else {
            self.setState(register, path);
          }
          return;
        },

        /**
        * Apply of list of moves to a path in a register
        * @methodOf tree.prototype
        * @param {string} register Name of the register.
        * @param {Array} moves List of moves to perform.
        * @param {Object} query Query for the last "down" move if needed.
        */
        move: function(register, moves, query) {
          var self = this;

          var localSerial = ++self.stateChangeSerial;


          if (!moves) return;

          var async = true;
          self.resolveMoves(self.getState(register), moves, query, function(err, newPath) {
            async = false;

            //Don't send an event if in the meantime the state changed.
            if (localSerial == self.stateChangeSerial) {
              self.moveTo(register, newPath);
            }
          });

          // While we're loading children of /directory, set us in the temporary
          // /directory/ state (with final slash)
          if (async && (moves == 'down' || (moves.length == 1 && moves[0] == 'down'))) {
            self.setState(register, (self.getState(register) + '/').replace(/\/\/$/, '/'));
          }

        },

        /**
        * Removes useless move sequences like ['up','down']
        * @methodOf tree.prototype
        * @param {Array} moves An array of moves.
        * @return {Array} Array A possibly smaller array of moves.
        */
        compactMoves: function(moves) {
          if (moves.length < 2) return [].concat(moves);
          var newMoves = [];

          for (var i = 0; i < moves.length; i++) {
            if ((i < moves.length - 1) && moves[i] == this.inverses[moves[i + 1]]) {
              i++;
            } else {
              newMoves.push(moves[i]);
            }
          }

          return newMoves;

        },



        /**
        * Apply a move sequence to a path and get the result path
        * @methodOf tree.prototype
        * @param {String} path The starting path.
        * @param {Array} moves An array of moves.
        * @param {Object} query A query object for the last "down" move if any.
        * @param {Function} callback A callback for the end path.
        */
        resolveMoves: function(path, moves, query, callback) {
          var self = this;

          // Accept moves as a string if there is only one
          if (_.isString(moves)) {
            moves = [moves];
          } else {
            moves = [].concat(moves);
          }

          //Can't resolve moves from a directory. Start from its first child.
          if (this.isDirectory(path)) {
            path = this.getDirName(path);
            moves.unshift('down');
          }
          moves = [].concat(this.compactMoves(moves));

          //console.warn("resolveMoves",path,moves,query);

          var next = function(err, newPath, newData) {
            if (err) return callback(err);
            //console.log("cb",JSON.stringify(moves),newPath,newData);
            //No more moves: we have reached destination, launch main callback
            if (moves.length === 0) {

              return callback(null, newPath, newData);
            }
            var move = moves.shift();

            if (move == 'up') {
              self._resolveMoveUp(newPath, next);
            } else if (move == 'next') {
              self._resolveMoveNextPrev(newPath, 1, next);
            } else if (move == 'prev') {
              self._resolveMoveNextPrev(newPath, -1, next);
            } else if (move == 'down') {
              var isLastDown = (_.indexOf(moves, 'down') == -1);
              self._resolveMoveDown(newPath, isLastDown ? query : false, next);
            }

          };

          next(null, path);

        },


        /**
        * Move next (direction=1) or prev (direction=-1)
        */
        _resolveMoveNextPrev: function(path, direction, callback) {
          var dir = this.getDirName(path) + '/';
          var basename = this.getBaseName(path);
          var i = this.id2index[dir][basename];

          i += direction;

          if (i >= 0 && i < this.tree[dir].length) {
            path = dir + this.tree[dir][i].id;
          }
          callback(null, path);
        },


        /**
        * Move up
        */
        _resolveMoveUp: function(path, callback) {
          var dir = this.getDirName(path);
          //Not yet at root level?
          if (dir !== '' || this.allowRootAccess) {
            path = dir;
          }
          callback(null, path);
        },


        /**
        * Move down
        */
        _resolveMoveDown: function(path, query, callback) {
          var self = this;


          // There is a registered children() function, will be called to get the children.
          if (self.childrenFunctions[path]) {

            query = self._prepareQuery(query);

            var gotChildren = function(error,children,options,fromCache) {
              if (error) return callback(error);
              //console.log('got children CB', fromCache, path, children, options);
              if (!fromCache) {
                self.addToQueryCache(path, query, children, options);
                for (var i = 0, l = children.length; i < l; i++) {
                  self.addToItemCache(path + '/' + children[i].id, children[i], options);
                }
                self.insert(path + '/', query, children, options);
              }
              if (!children.length){
                callback(null, path, []);
              }
              else{
                path = path + '/' + self.tree[path + '/'][0].id;
                callback(null, path, children);  
              }
              
            };

            var cached = self.checkQueryCache(path, query);
            if (cached) {
              //console.log('got cached', cached);
              gotChildren(null, cached.data, cached.options, true);
              return;
            }

            var loadingKey = path + '/ ' + JSON.stringify(query);

            //If it's already marked as being loaded, add ourselves to the callback queue
            if (self.beingLoaded[loadingKey]) {
              //console.log('being loaded', self.beingLoaded);
              self.beingLoaded[loadingKey].push(gotChildren);
              return;
            }

            self.beingLoaded[loadingKey] = [gotChildren];
            self.publish('loading', [path + '/', query], true);

            self.childrenFunctions[path](query, function(error, children, options) {
              var callbacks = self.beingLoaded[loadingKey];
              delete self.beingLoaded[loadingKey];

              _.each(callbacks, function(cb) {
                cb(error, children, options || {});
              });

            });


          //If we already have registered children
          } else if (self.tree[path + '/']) {

            if (self.tree[path + '/'] == 'loading') {
            //TODO fire when ready?
            } else {

              //Go to the first child
              if (self.tree[path + '/'].length > 0) {
                path = path + '/' + self.tree[path + '/'][0].id;
              }
              var dir = this.getDirName(path) + '/';

              callback(null, path, this.get(dir));

            }

          //Nothing down
          } else {

            callback(null, path, []);
          }
        },

        _prepareQuery: function(query) {
          query = _.extend({},this.options.defaultQuery, query || {});
          return query;
        },


        checkQueryCache: function(path, query) {
          var jsonQuery = JSON.stringify(query);
          if (this.queryCache[path] && this.queryCache[path][jsonQuery]) {

            if (+new Date() < this.queryCache[path][jsonQuery].expires) {
              return this.queryCache[path][jsonQuery];
            } else {
              delete this.queryCache[path][jsonQuery];
            }
          }
          return null;
        },

        addToQueryCache: function(path, query, data, options) {

          var cache = options.cache; //TODO default
          if (!cache) return;

          var jsonQuery = JSON.stringify(query);
          if (!this.queryCache[path]) this.queryCache[path] = {};
          this.queryCache[path][jsonQuery] = {
            expires: +new Date() + (cache * 1000),
            data: data,
            options: options
          };
        },

        checkItemCache: function(path) {
          if (this.itemCache[path]) {
            if (+new Date() < this.itemCache[path].expires) {
              return this.itemCache[path].data;
            } else {
              delete this.itemCache[path];
            }
          }
          return null;
        },

        addToItemCache: function(path, data, options) {

          var cache = options.cache; //TODO default
          if (!cache) return;

          this.itemCache[path] = {
            expires: +new Date() + (cache * 1000),
            data: data,
            options: options
          };
        },



        /**
        * Gets the data at some path in the tree, synchronously
        * @methodOf tree.prototype
        * @param {String} path The path.
        * @return Tree data.
        */
        get: function(path) {
          //Directory
          if (this.isDirectory(path)) {

            //if (this.beingLoaded[path]) {
            //    return "loading";
            return this.tree[path];

          //Leaf
          } else {

            var dir;
            if (path === '') {
              dir = '';
            } else {
              dir = this.getDirName(path) + '/';
            }

            var basename = this.getBaseName(path);

            //if (this.beingLoaded[dir]) {
            //    return "loading";
            if (this.tree[dir] && this.id2index[dir] !== null) {
              var i = this.id2index[dir][basename];
              if (i !== null) {
                return this.tree[dir][i];
              }
            }
            return null;

          }

        },




        /**
        * Gets the data at some path in the tree, asynchronously (Unfolds the tree if needed)
        * @methodOf tree.prototype
        * @param {string} path
        * @param {Object} query A query object for the last "down" move if any.
        * @param {Function} callback when finished.
        */
        fetch: function(path, query, callback) {
          var self = this;

          //console.warn('fetch', path, query);

          if (path == '/') {
            return callback(null, self.get('/'));
          }

          var isDirectory = self.isDirectory(path);

          var parts = path.substring(1).split('/');

          var current = '';

          if (!isDirectory) {
            var itemCached = this.checkItemCache(path);
            if (itemCached) {
              return callback(null, itemCached);
            }
          }

          var next = function() {

            //console.log('next tree', current, path, JSON.stringify(parts), parts.length);

            //Use the query parameter in the last down move
            self.resolveMoves(current, ['down'], (parts.length == 1) ? query : false, function(err, newPath, newData) {
              //console.log('got cb', newPath);
              if (parts.length == 1) {
                if (isDirectory) {
                  callback(null, newData);
                } else {
                  callback(null, self.get(path));
                }

              } else {
                current += '/' + parts.shift();
                next();
              }
            });

          };



          next();


        },



        /**
        * Tests if a path is a directory
        * @methodOf tree.prototype
        * @param {String} path The path.
        * @return {Boolean} Wheter the path is a directory.
        */
        isDirectory: function(path) {
          return path.charAt(path.length - 1) == '/';
        },

        /**
        * Returns the final component of a pathname
        * @methodOf tree.prototype
        * @param {String} path The path.
        * @return {String} Final component.
        */
        getBaseName: function(path) {
          var tmp = path.split('/');
          return tmp[tmp.length - 1];
        },


        sendChangeEvent: function(path) {
          this.publish('change', [path, this.get(path)]);
        },


        /**
        * Returns the directory component of a pathname
        * @methodOf tree.prototype
        * @param {String} path The path.
        * @return {String} Directory name.
        */
        getDirName: function(path) {
          return path.replace(/\/[^\/]*$/, '');
        },



        /**
        * Update just one bit of data. Not compatible with too much format() !
        * @methodOf tree.prototype
        * @param {String} path The path.
        * @param data The tree data.
        */
        update: function(path, data) {

          var tree = this.get(path);

          _.extend(tree, data);

          this.set(path, tree);

        },


        /**
        * Assigns data to a path in the tree
        * @methodOf tree.prototype
        * @param {String} path The path.
        * @param data The tree data.
        * @param {Function} callback Callback when done (some formatters may be asynchronous).
        */
        set: function(path, treeData, callback) {

          var data = _.clone(treeData);

          callback = callback || function() {};

          //console.log('set', path, data);
          var self = this;

          //When set() on a directory, do set()s on all its children
          if (self.isDirectory(path)) {

            self.tree[path] = [];
            self.id2index[path] = {};

            if (!data.length) {
              return callback();
            }

            var cb = _.after(data.length, function() {
              self.sendChangeEvent(path);
              callback();
            });

            for (var y = 0; y < data.length; y++) {
              self.id2index[path][data[y].id] = y;
              self.set(path + data[y].id, data[y], cb);
            }

          } else {

            var dir;

            //Special case for root element that has no directory.
            if (path === '') {
              dir = '';
              self.id2index[''] = {
                '': 0
              };
              self.tree[''] = [];
            } else {
              dir = self.getDirName(path) + '/';
            }

            var basename = self.getBaseName(path);

            // We have no base point to attach to...
            if (self.tree[dir] === null || self.id2index[dir] === null) {
              return callback('no base point');
            }

            var i = self.id2index[dir][basename];

            if (i === null) {
              return callback('no base point');
            }

            //Delete all the data below that point
            //TODO also other references ? (beingLoaded, childrenfunction, ..)
            _.each(self.tree, function(elt, key) {
              if (key.indexOf(path + '/') === 0) {
                delete self.tree[key];
              }
            });


            var children = data.children;
            delete data.children;

            var saveItem = function() {

              self.formatItem(path, data, function(error, newData) {
                self.tree[dir][i] = newData;

                self.sendChangeEvent(path);

                callback();
              });
            };

            if (_.isFunction(children)) {
              self.childrenFunctions[path] = children;

            } else if (_.isArray(children)) {
              self.set(path + '/', children, function(err) {
                if (err) return callback(err);
                saveItem();
              });
              return;
            }
            saveItem();

          }

        },


        /**
        * Insert data to a path in the tree
        * @methodOf tree.prototype
        * @param {String} path The path.
        * @param {Object} query Query used to position the data (uses query.skip mostly).
        * @param data The tree data.
        * @param {Object} options Options returned by the children() callback.
        */
        insert: function(path, query, data, options) {
          if (this.isDirectory(path)) {

            // very unoptimized implementation for now

            var oldData = this.get(path) || [];
            //console.warn("insert",path,query,data,"gets",oldData.slice(0, query.skip),data,oldData.slice(query.skip+data.length, oldData.length));
            this.set(path, oldData.slice(0, query.skip).concat(data, oldData.slice(query.skip + data.length, oldData.length)));

          } else {
            //TODO error
          }

        },

        /**
        * Formats an item of the tree before insertion
        * @methodOf tree.prototype
        * @param {String} path The path being formatter.
        * @param data The tree data to format.
        */
        formatItem: function(path, data, callback) {
          callback(null, data);
        },

        /**
        * Preloads all tree data
        * @methodOf tree.prototype
        */
        prefetchAll: function() {
          var self = this;
          self.subscribe('change', function(ev, data) {
            //console.log('data', data, self.childrenFunctions);
            var path = data[0];
            if (!self.isDirectory(path) && (self.childrenFunctions[path])) {

              self.moveTo('preload', path + '/');

            }


          });
        }


      });


  PubSub.mixin(Tree.prototype);
  State.mixin(Tree.prototype);

  return Tree;

}
)(Joshfire.loadModule('joshfire/main'),Joshfire.loadModule('joshfire/class'),Joshfire.loadModule('joshfire/mixins/pubsub'),Joshfire.loadModule('joshfire/mixins/state'),Joshfire.loadModule('joshfire/vendor/underscore'),Joshfire.loadModule('joshfire/vendor/json2'));
 };

Joshfire.definedModules['joshfire/utils/delayedswitch'] = function() { return (
function(Class) {


  return Class(
      /**
      * @lends utils_delayedswitch.prototype
      */
      {

        /**
        * @constructs
        * @class A on/off switch with delay and reset
        * @param {Function} stateON callback when ON.
        * @param {Function} stateOFF callback when OFF.
        * @param {Integer} delayON delay before calling stateON.
        */
        __constructor: function(stateON, stateOFF, delayON /*, todo delayOFF*/ ) {
          this._on = stateON;
          this._off = stateOFF;
          this.delayON = delayON;
          this.timer = false;
        },

        /**
        * @function on
        *
        */
        on: function() {
          if (!this.delayON) {
            if (this._on) this._on();
          } else if (!this.timer) {
            var self = this;
            this.timer = setTimeout(function() {
              self.timer = false;
              if (self._on) self._on();
            }, this.delayON);
          }
        },

        /**
        * @function off
        *
        */
        off: function() {
          if (this.timer) {
            clearTimeout(this.timer);
            this.timer = false;
          }
          if (this._off) this._off();
        },

        /**
        * @function reset
        *
        */
        reset: function() {
          this.off();
          this.on();
        }
      });


}
)(Joshfire.loadModule('joshfire/class'));
 };

Joshfire.definedModules['joshfire/uielement'] = function() { return (
function(J, Class, PubSub, State, DelayedSwitch, _) {

  var UIElementBase = Class(

      /**
      * @lends uielement.prototype
      */
      {
        /**
        * Get default options
        * @function
        * @return {Object} hash of options
        * <ul>
        * <li>hideDelay {int}: in seconds, delay before hiding. Defaults 0
        * <li>autoShow {bool}: Defaults true
        * <li>showOnFocus {bool}: Defaults true
        * <li>hideOnBlur {bool}: Defaults false
        * <li>innerTemplate {String}: element's inner template. Use underscorejs syntax. Defaults '&lt;%= htmlInner %&gt;'
        * <li>loadingTemplate {String}: displayed during loading. Defaults 'Loading...'
        * <li>template {String}: element's wrapper template. Defines element's css classes, id, .. Use underscorejs syntax<br />
        *    Default: &lt;div style="display:none;" class="josh-type-&lt;%=type%&gt; josh-id-&lt;%=id%&gt; &lt;%=htmlClass%&gt;" id="&lt;%= htmlId %&gt;" data-josh-ui-path="&lt;%= path %>"&gt;&lt;%= htmlOuter %&gt;&lt;/div&gt;
        * <li>autoRefresh {bool}: defaults true
        * <li>autoInsert {bool}: defaults true.
        * </ul>
        */
        getDefaultOptions: function() {
          return {
            hideDelay: 0,
            autoShow: true,
            showOnFocus: true,
            hideOnBlur: false,
            innerTemplate: '<%= htmlInner %>',
            innerHtmlId: false,
            htmlId: false,
            loadingTemplate: 'Loading...',
            template: '<div style="display:none;" class="josh-type-<%= type %> josh-id-<%= id %> <%= htmlClass %>" id="<%= htmlId %>" data-josh-ui-path="<%= path %>"><%= htmlOuter %></div>',
            autoRefresh: true,
            autoInsert: true,
            forceDataPathRefresh: false
          };
        },

        /**
        * @class Base class for UI Elements
        * @constructs
        * @borrows mixins_pubsub#publish as #publish
        * @borrows mixins_pubsub#subscribe as #subscribe
        * @borrows mixins_pubsub#unsubscribe as #unsubscribe
        * @borrows mixins_state#setState as #setState
        * @borrows mixins_state#setStates as #setStates
        * @borrows mixins_state#getState as #getState
        * @borrows mixins_state#onState as #onState
        * @borrows mixins_state#deleteState as #deleteState
        * @param {app} app Reference to the app object.
        * @param {String} id unique identifier.
        * @options {Object} Hash of options
        */
        __constructor: function(app, path, options) {

          var self = this;

          self.app = app;

          self.path = path;

          // /video/player => video_player
          self.id = path.substring(1).replace(/\//g, '_', path);

          self.options = _.extend(self.getDefaultOptions(), options || {});

          self.htmlClass = self.options.htmlClass || '';

          self.htmlId = self.getHtmlId();
          self.innerHtmlId = self.getInnerHtmlId();

          self.htmlEl = false;
          self.innerHtmlEl = false;

          self.parentEl = false;
          self.parentUi = false;

          self.hasFocus = false;

          self.nextShowHide = false;

          self.children = [];

          self.showHideSwitch = new DelayedSwitch(function() {
            self.processShowHide();
          }, null, self.options.hideDelay);

          // Bind event handlers present in the options
          _.each(self.options, function(handler, k) {
            if (k.substring(0, 2) == 'on' && typeof handler == 'function') {
              var evtName = k.charAt(2).toLowerCase() + k.substring(3);
              self.subscribe(evtName, function(ev, data, token) {
                handler(self, ev, data, token);
              });
            }
          });

          //Check freshness automatically on each state event
          self.subscribe('state', function(ev, data) {
            self.checkFresh();
          });

          self.init();

          //Bind to the data
          if (!self.data) {
            self.data = false;
            self.dataPath = false;
          }

          self.publish('afterInit');
        },

        /**
        * @function
        */
        init: function() {},

        /**
        * Performs further init of the element
        * @function
        */
        setup: function(callback) {
          var self = this;

          if (self.options.uiDataMaster) {
            self.app.ui.fetch(self.options.uiDataMaster, false, function() {
              var master = self.app.ui.element(self.options.uiDataMaster);
              master.subscribe('select', function(ev, data) {
                if (!data.length || !data[0].length || !master.dataPath) return;
                var dataPath = master.dataPath + data[0];
                self.setDataPath(dataPath);
              });
            });
          }

          if (self.options.uiDataSync) {
            self.app.ui.fetch(self.options.uiDataSync, false, function() {

              var master = self.app.ui.element(self.options.uiDataSync);
              master.subscribe('data', function(ev, data) {
                if (data.length) {
                  self.setData(data[0]);
                }
              });
            });
          }

          if (typeof self.options.dataPath == 'string') {
            self.setDataPath(self.options.dataPath);
          }

          callback();

        },

        /**
        * Sets the tree root associated with the element
        * @function
        * @param {String} dataPath Tree path.
        */
        setDataPath: function(dataPath) {
          var self = this;
   if (self.dataPath != dataPath || self.options.forceDataPathRefresh) {
            self.setLoading(true);

            self.setState('dataPath', dataPath);

            self.dataPath = dataPath;

            self.app.data.fetch(dataPath, false, function(err, data) {
              //Check that the callback didn't come late
              if (self.dataPath != dataPath) return;
              self.setLoading(false);

              //TODO What to do in this case? fallback to previous dataPath?
              if (err) return;
              self.setData(data);

              if (!self.dataBound) self.bindToDataPath();

            });
          }
        },

        /**
        * @function
        */
        bindToDataPath: function() {
          var self = this;
          self.dataBound = true;

          /* loading events are currently unreliable, fire them from setDataPath() until fixed
          self.app.data.subscribe('loading', function(ev, data) {
          if (self.dataPath == data[0]) {
          self.setLoading(true);
          }
          });
          */

          self.app.data.subscribe('change', function(ev, data) {
            if (self.dataPath == data[0]) {
              self.setData(data[1]);
            }
          });
        },

        /**
        * Puts the element in loading mode
        * @function
        * @param {Boolean} is Loading.
        */
        setLoading: function(isLoading) {

          this.setState('loading', isLoading);
          if (isLoading && this.htmlEl && this.options.loadingTemplate && !this.children.length) {
            this.htmlEl.innerHTML = this.template(this.options.loadingTemplate);
            this.htmlIsLoader = true;
          }
        },


        /**
        * focus
        * @function
        *
        */
        focus: function() {

          var self = this;

          self.publish('beforeFocus', null, true);
          if (!self.hasFocus) {

            if (self.options.showOnFocus === true) {

              //Show all parents
              var pointer = this.path;

              for (var i = 0; i < self.path.split('/').length - 1; i++) {
                self.app.ui.resolveMoves(pointer, 'up', false, function(err, newPath) {
                  self.app.ui.element(newPath).show();
                });
              }
              self.show();
            }

          }

          this.app.ui.setState('focus', this.path);

          this.hasFocus = true;
          this.publish('afterFocus');
        },

        /**
        * blur
        * @function
        */
        blur: function() {
          //console.log("onBlur", this.id, this.options.persistFocus);
          this.publish('beforeBlur', null, true);

          if (this.options.hideOnBlur === true) {
            this.hideDelayed();
          }

          this.hasFocus = false;

          this.publish('afterBlur');
        },


        /**
        * @function
        * @param {Function|String} tpl. If function, _.template(tpl, this) else tpl(this).
        * @return {String}
        */
        template: function(tpl) {
          this._ = _;
          if (_.isFunction(tpl)) {
            return tpl(this);
          } else {
            return _.template(tpl, this);
          }
        },

        /**
        * Do nothing -- this is up to the adapter
        * @function
        */
        show: function() {},

        /**
        * Do nothing -- this is up to the adapter
        * @function
        */
        hide: function() {},

        /**
        * Has CSS class?
        * @function
        */
        hasHtmlClass: function(name) {
          if (!name || typeof name != 'string') return;
          return (' ' + this.htmlEl.className + ' ').indexOf(' ' + name + ' ') != -1;
        },

        /**
        * Add a CSS class
        * @function
        */
        addHtmlClass: function(name) {
          if (!name || typeof name != 'string') return;
          if (!this.hasHtmlClass(name)) {
            this.htmlEl.className += ' ' + name;
          }
        },

        /**
        * Remove a CSS class
        * @function
        */
        removeHtmlClass: function(name) {
          if (!name || typeof name != 'string') return;
          this.htmlEl.className = (' ' + this.htmlEl.className + ' ').split(' ' + name + ' ').join(' ').slice(1, -1);
        },

        /**
        * Toggle a CSS class
        * @function
        */
        toggleHtmlClass: function(name) {
          if (!name || typeof name != 'string') return;
          if (this.hasHtmlClass(name)) {
            this.removeHtmlClass(name);
          } else {
            this.addHtmlClass(name);
          }
        },

        /**
        * @function
        */
        processShowHide: function() {
          if (this.nextShowHide == 'show') {
            this.show();
          } else {
            this.hide();
          }
        },

        /**
        * Show the element, possibly with a delay
        * @function
        */
        showDelayed: function() {
          this.nextShowHide = 'show';
          this.showHideSwitch.reset();
        },

        /**
        * Hide the element, possibly with a delay
        * @function
        */
        hideDelayed: function() {
          this.nextShowHide = 'hide';
          this.showHideSwitch.reset();
        },

        /**
        * Insert into ui parent
        * @function
        */

        insertInParent: function() {
          if (this.parentUi) {
            // Register as a children in the parent
            this.parentUi.children.push(this);
          }
        },

        /**
        * Insert the element in the DOM & call callback
        * @function
        * @param {Object} parentElement
        * @param {Function} callback
        */
        insert: function(parentElement,callback) {
          var self = this;

          if (self.options.autoRefresh) {
            self.subscribe('data', function() {
              self.refresh();
            });
          }

          this.publish('beforeInsert', [parentElement], true);

          this.parentUi = false;
          this.parentInnerHtmlEl = false;

          if (parentElement) {

            //Is it a joshlib element ? (todo better check, instanceof?)
            if (parentElement.app && parentElement.options) {
              this.parentUi = parentElement;
              if (parentElement.innerHtmlEl) {
                this.parentInnerHtmlEl = parentElement.innerHtmlEl;
              }
            } else {
              this.parentInnerHtmlEl = parentElement;
            }

          // No argument was given, try the parent in the tree.ui
          } else if (this.path.length) {
            this.parentUi = this.app.ui.element(this.app.ui.getDirName(this.path));
            this.parentInnerHtmlEl = this.parentUi.innerHtmlEl;
          }
          this.insertInParent();

          this.setState("inserted",true);

          if (this.options.autoShow) {
            this.show();
          }

          this.publish('afterInsert');

          this.insertChildren(false, callback);
        },


        /**
        * Insert element's children
        * @function
        * @param {bool} forceInsert
        * @param {Function} callback
        */
        insertChildren: function(forceInsert, callback) {
          var self = this;

          if (!callback) callback = function() {};

          self.app.ui.fetch(self.path + '/', false, function(err, elts) {
            if (!elts || !elts.length) return callback(err);

            var allCb = _.after(elts.length, function() {
              callback();
            });

            // Insert children elements that have the autoInsert flag
            for (var i = 0; i < elts.length; i++) {
              if (forceInsert || elts[i].element.options.autoInsert) {
                elts[i].element.insert(self, allCb);
              } else {
                allCb();
              }
            }
            return true;
          });

        },

        /**
        * Refresh data in the UIElement
        * @function
        * @param {Function} callback callback when refreshed.
        */
        refresh: function(callback) {
          if (!this.getState("inserted")) return;

          //Reload the innerTemplate if the element was in loading state
          if (this.htmlIsLoader || this.children.length == 0) {

            this.htmlInner = this.getInnerHtml();
            this.htmlEl.innerHTML = this.template(this.options.innerTemplate);
            this.htmlIsLoader = false;
          } else {
            this.innerHtmlEl.innerHTML = this.getInnerHtml();
          }

          this.publish('afterRefresh');

          if (callback) callback();
        },

        /**
        * Gets the actual DOM ElementId of the UIElement
        * @return {String} ElementId.
        */
        getHtmlId: function() {
          if (this.options.htmlId) {
            return this.options.htmlId;
          } else {
            return this.app.id + '__' + this.id.toString().replace(/_/g, '__');
          }
        },

        /**
        * Gets the inner HTML ElementId
        * By default it's the same as the htmlId.
        * @return {String} ElementId.
        */
        getInnerHtmlId: function() {
          if (this.options.innerHtmlId) {
            return this.options.innerHtmlId;
          } else {
            return this.getHtmlId();
          }
        },

        /**
        * Check if element is fresh, and publish state fresh accordingly
        * @function
        **/
        checkFresh: function() {
          //          console.log('checkfresh', this.path, this.isFresh(), this.parentUi ? this.parentUi.path : 'noparent');
          if (this.isFresh()) {
            this.setState('fresh', true);
            this.publish('fresh');
          } else {
            this.setState('fresh', false);
          }

          // Update the freshness of the parent
          if (this.parentUi) {
            this.parentUi.checkFresh();
          }
        },

        /**
        * @function
        * @return {bool}
        */
        isFresh: function() {

          //state=fresh if all children are fresh and it's fresh itself.
          if (!this.getState('loading')) {
            for (var i = 0, l = this.children.length; i < l; i++) {
              //console.log("testing children",i,"of ",this.path,"fresh:");
              if (!this.children[i].isFresh()) {
                //console.log("NO");
                return false;
              }
            }
            return true;
          }
          return false;

        },

        /**
        * Get element's html, processed via this.template()
        * @function
        * @return {String}
        **/
        getHtml: function() {
          this.htmlInner = this.getInnerHtml();
          this.htmlOuter = this.template(this.options.innerTemplate);
          return this.template(this.options.template);
        },

        /**
        * @function
        * @param {Function} callback
        **/
        getFreshHtml: function(callback) {
          var self = this;

          if (this.isFresh()) { //this.getState('fresh')) {
            callback(null, this.getHtml());
          } else {
            var token = this.subscribe('fresh', function(ev,data) {
              self.unsubscribe(token);
              callback(null, self.getHtml());
            });

          }
        },

        /**
        * @function
        * @return {String}
        */
        getInnerHtml: function() {
          return '';
        },

        /**
        * Sets the data for the UIElement
        * @param data Data.
        */
        setData: function(data) {
          this.data = data;
          this.publish('data', [data]);
          this.setLoading(false);
        }

      });

  PubSub.mixin(UIElementBase.prototype);
  State.mixin(UIElementBase.prototype);

  return UIElementBase;
}
)(Joshfire.loadModule('joshfire/main'),Joshfire.loadModule('joshfire/class'),Joshfire.loadModule('joshfire/mixins/pubsub'),Joshfire.loadModule('joshfire/mixins/state'),Joshfire.loadModule('joshfire/utils/delayedswitch'),Joshfire.loadModule('joshfire/vendor/underscore'));
 };

Joshfire.definedModules['joshfire/adapters/ios/uielement'] = function() { return (
function(UIElement, Class, _) {


  var _id = function(elt) {
    return document.getElementById(elt);
  };

  var _oldDisplayValue = 'block';

  return Class(UIElement, {

    getDefaultOptions: function() {
      return _.extend(this.__super(), {});
    },

    remove: function() {
      $('#' + this.htmlId).remove();
    },

    insertInParent: function(parentElement) {
      this.__super();
      if (!_id(this.htmlId)) {
        $(this.parentInnerHtmlEl).append(this.getHtml());
      }
      this.htmlEl = _id(this.htmlId);
      this.innerHtmlEl = _id(this.innerHtmlId);
      /*
      if (!_id(this.htmlId)) {

        // TODO This sometimes fails on iPad. Report this bug on zepto.
        //$(this.parentHtmlEl).append(this.getHtml());

        var div = document.createElement('div');
        div.innerHTML = this.getHtml();
        this.parentInnerHtmlEl.insertBefore(div);

      }

      this.htmlEl = _id(this.htmlId);
      this.innerHtmlEl = _id(this.innerHtmlId);
      */
    },


    /**
    * Refresh data in the UIElement
    * @function
    * @param {Function} callback callback when refreshed.
    */
    refresh: function(callback) {

      if (!_id(this.htmlId) || !_id(this.htmlId).id) {
        if (this.options.autoInsert === true) {
          this.insert(this.parentEl);
        }
      } else {

        //console.log("refresh",this.innerHtmlEl);
        //this.innerHtmlEl.innerHTML = this.getInnerHtml();

        //this.insertChildren(true);

      }
      this.__super(callback);
    },
    /**
    * Show the element right away
    * @function
    */
    show: function() {
      this.publish('beforeShow', null, true);
      this._show();
      this.publish('afterShow');
      this.showHideSwitch.off();
    },

    /**
    * Hide the element right away
    * @function
    */
    hide: function() {
      this.publish('beforeHide', null, true);
      this._hide();
      this.publish('afterHide');
      this.showHideSwitch.off();
    },
    _show: function() {
      if (!_id(this.htmlId)) return;
      _oldDisplayValue = _id(this.htmlId).style.display;
      _id(this.htmlId).style.display = 'block';
    },

    _hide: function() {
      if (!_id(this.htmlId)) return;
      _oldDisplayValue = _id(this.htmlId).style.display;
      _id(this.htmlId).style.display = 'none';
    }

  });

}
)(Joshfire.loadModule('joshfire/uielement'),Joshfire.loadModule('joshfire/class'),Joshfire.loadModule('joshfire/vendor/underscore'));
 };

Joshfire.definedModules['joshfire/uielements/panel'] = function() { return (
function(UIElement, Class) {
  /**
  * @class Panel base class
  * @name uielements_panel
  * @augments uielement
  */
  return Class(UIElement,
      /**
      * @lends uielements_panel.prototype
      */
      {
        type: 'Panel',

        /**
        * Get panel inner html. this.options.content || this.data.content
        * @function
        *
        */
        getInnerHtml: function() {
          if (this.options.content) {
            return this.options.content;
          } else {
            if (this.data && this.data.content) {
              return this.data.content;
            } else {
              return this.__super();
            }
          }
        },

        refresh: function(callback) {
          // Don't refresh if we have children
          if (!this.children.length) {
            return this.__super(callback);
          }
        }
      }
  );
}
)(Joshfire.loadModule('joshfire/adapters/ios/uielement'),Joshfire.loadModule('joshfire/class'));
 };

Joshfire.definedModules['joshfire/tree.ui'] = function() { return (
function(J, Class, Tree, _, Panel) {


  /**
  * @class UI Tree base class
  * @name tree.ui
  * @augments tree
  */
  return Class(Tree,
      /**
      * @lends tree.ui.prototype
      *
      */
      {

        allowRootAccess: true,

        //List of elements pending setup
        setupQueue: [],

        /**
        * @override
        * @inheritDoc
        */
        formatItem: function(path, data, callback) {
          var self = this;

          this.setupQueue.push(path);

          if (_.isString(data.type)) {
            //todo !joshfire
            J.require(['joshfire/uielements/' + data.type], function(eltClass) {
              data.element = new eltClass(self.app, path, data);
              callback(null, data);
            });
          } else {
            data.element = new data.type(self.app, path, data);
            callback(null, data);
          }
        },


        setup: function(callback) {
          var self = this;

          self.__super(function() {
            self.setupElements(callback);
          });
        },

        // Processes the setup Queue.
        setupElements: function(callback) {
          var self = this;

          var next = function() {
            if (!self.setupQueue.length) return callback();
            var path = self.setupQueue.shift();
            self.element(path).setup(next);
          }
          next();

        },

        /**
        * @private
        */
        addRootElement: function(callback) {

          //Set the first container panel
          this.set('', {
            'id': 'root',
            'type': 'panel',
            'autoShow': true
          }, callback);

        },

        /**
        * @private
        */
        init: function() {

          var self = this;

          this.__super();

          //Manage focus to only one UI Element
          self.lastFocusedPath = null;

          self.subscribe('state', function(ev, data) {
            var register = data[0];
            var path = data[1];

            if (register == 'focus') {
              var elt = self.element(path);
              //console.log('focusing', path, self.lastFocusedPath);
              if (path != self.lastFocusedPath) {
                if (self.lastFocusedPath) {
                  self.element(self.lastFocusedPath).blur();
                }

                elt.focus();
                self.lastFocusedPath = path;
              }

            }
          });

          // Forward global events to the UI Element that has focus
          self.app.subscribe('input', function(ev, data) {
            if (self.lastFocusedPath) {
              self.element(self.lastFocusedPath).publish(ev, data);
            }
          });



        },

        /**
        * @override
        * @inheritDoc
        */
        set: function(path, data, callback) {
          var self = this;

          //only at first set of root level
          if (path == '/' && !this.tree[''] && !this.tree['/']) {

            // buildTree() returned an array, add a root element automatically
            if (_.isArray(data)) {
              this.addRootElement(function(err) {
                self.set(path, data, callback);
              });
              return true;

            // buildTree() returned a root element, fix the path
            } else {
              path = '';
            }
          }
          return this.__super(path, data, callback);
        },

        /**
        * Gets an element instance
        * @function
        * @param {string} path Path in the tree.
        * @return {uielement | false} UI Element instance.
        */
        element: function(path) {
          var tmp = this.get(path);
          if (!tmp) {
            console.error('Error retrieving ui element', path);
            return false;
          }
          return tmp.element;
        }

      });


}
)(Joshfire.loadModule('joshfire/main'),Joshfire.loadModule('joshfire/class'),Joshfire.loadModule('joshfire/tree'),Joshfire.loadModule('joshfire/vendor/underscore'),Joshfire.loadModule('joshfire/uielements/panel'));
 };

Joshfire.definedModules['joshfire/tree.data'] = function() { return (
function(Tree) {

  /**
  * @class Data Tree base class
  * @name tree.data
  * @augments tree
  */
  return Tree;
}
)(Joshfire.loadModule('joshfire/tree'));
 };

Joshfire.definedModules['joshfire/app'] = function() { return (
function(J, Class, UITree, DataTree, PubSub, State, _) {
  var App = Class(
      /**
      * @lends app.prototype
      */
      {
        /**
        * The id of the application
        * @type {string}
        * @fieldOf app.prototype
        */
        id: 'DefaultAppId',

        /**
        * Gets default options. Override it in your app class to provide different defaults
        * @methodOf app.prototype
        * @return {Object} Hash of default options.
        */
        getDefaultOptions: function() {
          return {
            autoSetup: true,
            uiTree: false,
            inputs: [],
            dataTree: false,
            autoInsert: false
          };
        },

        /**
        * @constructs
        * @borrows mixins_pubsub#publish as #publish
        * @borrows mixins_pubsub#subscribe as #subscribe
        * @borrows mixins_pubsub#unsubscribe as #unsubscribe
        * @borrows mixins_state#setState as #setState
        * @borrows mixins_state#setStates as #setStates
        * @borrows mixins_state#getState as #getState
        * @borrows mixins_state#onState as #onState
        * @borrows mixins_state#deleteState as #deleteState
        * @class The base Application class
        * @param {Object} options Options for the app.
        */
        __constructor: function(options) {

          this.options = _.extend(this.getDefaultOptions(), options || {});

          this.init();

          if (this.options.autoSetup) {
            this.setupAll(function(err) {});
          }
        },

        /**
        * Overriden in adapters
        * @private
        */
        init: function() {

        },

        /**
        * Performs further setup of the app. Override it in your app class
        * @methodOf app.prototype
        * @param {Function} callback when finished.
        */
        setup: function(callback) {
          callback();
        },

        /**
        * Performs setup of core components : Data tree, UI tree, Inputs, then calls setup()
        * Fires either an "error" event or a "ready" event.
        * @methodOf app.prototype
        * @param {Function} callback when finished.
        */
        setupAll: function(callback) {
          var self = this;
          var err = function(error) {
            self.publish('error', [error]);
            callback(error);
          };

          self.setupDataTree(function(error) {
            if (error) return err(error);

            self.setupUiTree(function(error) {
              if (error) return err(error);

              self.setupInputs(function(error) {
                if (error) return err(error);

                self.setup(function(error) {
                  if (error) return err(error);

                  self.publish('ready');
                  callback(null, true);

                });
              });
            });
          });
        },

        /**
        * Setups the UI Tree
        * @methodOf app.prototype
        * @param {Function} callback when finished.
        */
        setupUiTree: function(callback) {
          if (this.options.uiTree || this.uiTree) {
            this.ui = new UITree(this, 'ui', {
              'tree': this.options.uiTree || this.uiTree
            });
            this.ui.setup(callback);
          } else if (this.options.uiClass || this.uiClass) {
            this.ui = new (this.options.uiClass || this.uiClass)(this, 'ui');
            this.ui.setup(callback);
          } else {
            callback(null);
          }

        },

        /**
        * Setups the Data Tree
        * @methodOf app.prototype
        * @param {Function} callback when finished.
        */
        setupDataTree: function(callback) {
          if (this.options.dataTree || this.dataTree) {
            this.data = new DataTree(this, 'data', {
              'tree': this.options.dataTree || this.dataTree
            });
            this.data.setup(callback);
          } else if (this.options.dataClass || this.dataClass) {
            this.data = new (this.options.dataClass || this.dataClass)(this, 'data');
            this.data.setup(callback);
          } else {
            callback(null);
          }
        },

        /**
        * Setups the Inputs as defined in app.options.inputs
        * @methodOf app.prototype
        * @param {Function} callback when finished.
        */
        setupInputs: function(callback) {
          var self = this;

          if (self.options.inputs.length === 0) {
            return callback(null);
          }
          var done = _.after(self.options.inputs.length, function() {
            callback(null);
          });

          self.inputs = {};
          _.each(self.options.inputs, function(input) {

            var init = function(Input) {
              self.inputs[input] = new Input(self, input);
              self.inputs[input].setup(done);
            };
            if (_.isString(input)) {
              J.require(['joshfire/inputs/' + input], init);
            } else {
              init(input);
            }

          });
        }
      });

  PubSub.mixin(App.prototype);
  State.mixin(App.prototype);

  return App;
}
)(Joshfire.loadModule('joshfire/main'),Joshfire.loadModule('joshfire/class'),Joshfire.loadModule('joshfire/tree.ui'),Joshfire.loadModule('joshfire/tree.data'),Joshfire.loadModule('joshfire/mixins/pubsub'),Joshfire.loadModule('joshfire/mixins/state'),Joshfire.loadModule('joshfire/vendor/underscore'));
 };

Joshfire.definedModules['joshfire/vendor/zepto'] = function() { return (
function(){
  
  (function(undefined){
  if (String.prototype.trim === undefined) // fix for iOS 3.2
    String.prototype.trim = function(){ return this.replace(/^\s+/, '').replace(/\s+$/, '') };

  // For iOS 3.x
  // from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce
  if (Array.prototype.reduce === undefined)
    Array.prototype.reduce = function(fun){
      if(this === void 0 || this === null) throw new TypeError();
      var t = Object(this), len = t.length >>> 0, k = 0, accumulator;
      if(typeof fun != 'function') throw new TypeError();
      if(len == 0 && arguments.length == 1) throw new TypeError();

      if(arguments.length >= 2)
       accumulator = arguments[1];
      else
        do{
          if(k in t){
            accumulator = t[k++];
            break;
          }
          if(++k >= len) throw new TypeError();
        } while (true);

      while (k < len){
        if(k in t) accumulator = fun.call(undefined, accumulator, t[k], k, t);
        k++;
      }
      return accumulator;
    };

})();
var Zepto = (function() {
  var undefined, key, css, $$, classList,
    emptyArray = [], slice = emptyArray.slice,
    document = window.document,
    elementDisplay = {}, classCache = {},
    getComputedStyle = document.defaultView.getComputedStyle,
    fragmentRE = /^\s*<[^>]+>/,
    container = document.createElement('div');

  function isF(value) { return ({}).toString.call(value) == "[object Function]" }
  function isO(value) { return value instanceof Object }
  function isA(value) { return value instanceof Array }

  function compact(array) { return array.filter(function(item){ return item !== undefined && item !== null }) }
  function flatten(array) { return [].concat.apply([], array) }
  function camelize(str)  { return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
  function uniq(array)    { return array.filter(function(item,index,array){ return array.indexOf(item) == index }) }

  function classRE(name){
    return name in classCache ?
      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'));
  }

  function defaultDisplay(nodeName) {
    var element, display;
    if (!elementDisplay[nodeName]) {
      element = document.createElement(nodeName);
      document.body.insertAdjacentElement("beforeEnd", element);
      display = getComputedStyle(element, '').getPropertyValue("display");
      element.parentNode.removeChild(element);
      display == "none" && (display = "block");
      elementDisplay[nodeName] = display;
    }
    return elementDisplay[nodeName];
  }

  function fragment(html) {
    container.innerHTML = ('' + html).trim();
    return slice.call(container.childNodes);
  }

  function Z(dom, selector){
    dom = dom || emptyArray;
    dom.__proto__ = Z.prototype;
    dom.selector = selector || '';
    return dom;
  }

  function $(selector, context){
    if (!selector) return Z();
    if (context !== undefined) return $(context).find(selector);
    else if (isF(selector)) return $(document).ready(selector);
    else if (selector instanceof Z) return selector;
    else {
      var dom;
      if (isA(selector)) dom = compact(selector);
      else if (selector instanceof Element || selector === window || selector === document)
        dom = [selector], selector = null;
      else if (fragmentRE.test(selector)) dom = fragment(selector);
      else if (selector.nodeType && selector.nodeType == 3) dom = [selector];
      else dom = $$(document, selector);
      return Z(dom, selector);
    }
  }

  $.extend = function(target, source){ for (key in source) target[key] = source[key]; return target }
  $.qsa = $$ = function(element, selector){ if (!selector) return Z(); return slice.call(element.querySelectorAll(selector)) }

  function filtered(nodes, selector){
    return selector === undefined ? $(nodes) : $(nodes).filter(selector);
  }

  function funcArg(context, arg, idx, payload){
   return isF(arg) ? arg.call(context, idx, payload) : arg;
  }

  $.isFunction = isF;
  $.isObject = isO;
  $.isArray = isA;

  $.fn = {
    forEach: emptyArray.forEach,
    map: emptyArray.map,
    reduce: emptyArray.reduce,
    push: emptyArray.push,
    indexOf: emptyArray.indexOf,
    concat: emptyArray.concat,
    ready: function(callback){
      if (document.readyState == 'complete' || document.readyState == 'loaded') callback();
      document.addEventListener('DOMContentLoaded', callback, false); return this;
    },
    get: function(idx){ return idx === undefined ? this : this[idx] },
    size: function(){ return this.length },
    remove: function(){ return this.each(function(){ this.parentNode.removeChild(this) }) },
    each: function(callback){
      this.forEach(function(el, idx){ callback.call(el, idx, el) });
      return this;
    },
    filter: function(selector){
      return $([].filter.call(this, function(element){
        return $$(element.parentNode, selector).indexOf(element) >= 0;
      }));
    },
    add:function(selector,context){
      return $(uniq(this.concat($(selector,context))));
    },
    is: function(selector){
      return this.length > 0 && $(this[0]).filter(selector).length > 0;
    },
    not: function(selector){
      var nodes=[];
      if (isF(selector) && selector.call !== undefined)
        this.each(function(idx){
          if (!selector.call(this,idx)) nodes.push(this);
        });
      else {
        var ignores = slice.call(
          typeof selector == 'string' ?
            this.filter(selector) :
            selector instanceof NodeList ? selector : $(selector));
        slice.call(this).forEach(function(el){
          if (ignores.indexOf(el) < 0) nodes.push(el);
        });
      }
      return $(nodes);
    },
    eq: function(idx){ return $(this[idx]) },
    first: function(){ return $(this[0]) },
    last: function(){ return $(this[this.length - 1]) },
    find: function(selector){
      var result;
      if (this.length == 1) result = $$(this[0], selector);
      else result = flatten(this.map(function(el){ return $$(el, selector) }));
      return $(result);
    },
    closest: function(selector, context){
      var node = this[0], nodes = $$(context !== undefined ? context : document, selector);
      if (nodes.length === 0) node = null;
      while(node && node !== document && nodes.indexOf(node) < 0) node = node.parentNode;
      return $(node !== document && node);
    },
    parents: function(selector){
      var ancestors = [], nodes = this;
      while (nodes.length > 0)
        nodes = compact(nodes.map(function(node){
          if ((node = node.parentNode) && node !== document && ancestors.indexOf(node) < 0) {
            ancestors.push(node);
            return node;
          }
        }));
      return filtered(ancestors, selector);
    },
    parent: function(selector){
      return filtered(uniq(compact(this.pluck('parentNode'))), selector);
    },
    children: function(selector){
      return filtered(flatten(this.map(function(el){ return slice.call(el.children) })), selector);
    },
    siblings: function(selector){
      return filtered(flatten(this.map(function(el){
        return slice.call(el.parentNode.children).filter(function(child){ return child!==el });
      })), selector);
    },
    empty: function(){ return this.each(function(){ this.innerHTML = '' }) },
    pluck: function(property){ return this.map(function(element){ return element[property] }) },
    show: function(){
      return this.each(function() {
        this.style.display == "none" && (this.style.display = null);
        if (getComputedStyle(this, '').getPropertyValue("display") == "none") {
          this.style.display = defaultDisplay(this.nodeName)
        }
      })
    },
    replaceWith: function(newContent) {
      return this.each(function() {
        var element = $(this),
            prev = element.prev();
        element.remove();
        prev.after(newContent);
      });
    },
    hide: function(){
      return this.css("display", "none")
    },
    toggle: function(){
      return this.css("display") == "none" ? this.show() : this.hide();
    },
    prev: function(){ return $(this.pluck('previousElementSibling')) },
    next: function(){ return $(this.pluck('nextElementSibling')) },
    html: function(html){
      return html === undefined ?
        (this.length > 0 ? this[0].innerHTML : null) :
        this.each(function(idx){ this.innerHTML = funcArg(this, html, idx, this.innerHTML) });
    },
    text: function(text){
      return text === undefined ?
        (this.length > 0 ? this[0].innerText : null) :
        this.each(function(){ this.innerText = text });
    },
    attr: function(name, value){
      return (typeof name == 'string' && value === undefined) ?
        (this.length > 0 && this[0].nodeName == 'INPUT' && this[0].type == 'text' && name == 'value') ? (this.val()) :
        (this.length > 0 ? this[0].getAttribute(name) || (name in this[0] ? this[0][name] : undefined) : undefined) :
        this.each(function(idx){
          if (isO(name)) for (key in name) this.setAttribute(key, name[key])
          else this.setAttribute(name, funcArg(this, value, idx, this.getAttribute(name)));
        });
    },
    removeAttr: function(name) {
      return this.each(function() { this.removeAttribute(name); });
    },
    data: function(name, value){
      return this.attr('data-' + name, value);
    },
    val: function(value){
      return (value === undefined) ?
        (this.length > 0 ? this[0].value : null) :
        this.each(function(){
          this.value = value;
        });
    },
    offset: function(){
      if(this.length==0) return null;
      var obj = this[0].getBoundingClientRect();
      return {
        left: obj.left + document.body.scrollLeft,
        top: obj.top + document.body.scrollTop,
        width: obj.width,
        height: obj.height
      };
    },
    css: function(property, value){
      if (value === undefined && typeof property == 'string')
        return this[0].style[camelize(property)] || getComputedStyle(this[0], '').getPropertyValue(property);
      css = '';
      for (key in property) css += key + ':' + property[key] + ';';
      if (typeof property == 'string') css = property + ':' + value;
      return this.each(function() { this.style.cssText += ';' + css });
    },
    index: function(element){
      return this.indexOf($(element)[0]);
    },
    hasClass: function(name){
      return classRE(name).test(this[0].className);
    },
    addClass: function(name){
      return this.each(function(idx) {
        classList = [];
        var cls = this.className, newName = funcArg(this, name, idx, cls);
        newName.split(/\s+/g).forEach(function(klass) {
          if (!$(this).hasClass(klass)) {
            classList.push(klass)
          }
        }, this);
        classList.length && (this.className += (cls ? " " : "") + classList.join(" "))
      })
    },
    removeClass: function(name){
      return this.each(function(idx) {
        classList = this.className;
        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass) {
          classList = classList.replace(classRE(klass), " ")
        });
        this.className = classList.trim()
      })
    },
    toggleClass: function(name, when){
      return this.each(function(idx){
       var cls = this.className, newName = funcArg(this, name, idx, cls);
       ((when !== undefined && !when) || $(this).hasClass(newName)) ?
         $(this).removeClass(newName) : $(this).addClass(newName)
      });
    },
    submit: function () {
      return this.each(function () {
        try {
          // Submit first form element
          this.submit();
          return;
        } catch(e) {};
      });
    }
  };

  ['width', 'height'].forEach(function(property){
    $.fn[property] = function(){ var offset = this.offset(); return offset ? offset[property] : null }
  });

  var adjacencyOperators = [ 'prepend', 'after', 'before', 'append' ];
  function insert(operator, element, other) {
    var parent = (!operator || operator == 3) ? element : element.parentNode;
    parent.insertBefore(other,
      !operator ? parent.firstChild :         // prepend
      operator == 1 ? element.nextSibling :   // after
      operator == 2 ? element :               // before
      null);                                  // append
  }

  adjacencyOperators.forEach(function(key, operator) {
    $.fn[key] = function(html){
      if (typeof(html) != 'object')
        html = fragment(html);

      return this.each(function(index, element){
        if (html.length || html instanceof Z) {
          dom = html;
          for (var i=0; i<dom.length; i++) {
            var e = dom[operator < 2 ? dom.length-i-1 : i];
            insert(operator, element, e);
          }
        } else {
          insert(operator, element, html);
        }
      });
    };
  });

  var reverseAdjacencyOperators = [ 'append', 'prepend' ];

  reverseAdjacencyOperators.forEach(function(key) {
	$.fn[key+'To'] = function(html){
		if (typeof(html) != 'object')
	      html = fragment(html);

	    html[key](this);
	    return this;
	  };
  });

  Z.prototype = $.fn;

  return $;
})();

'$' in window || (window.$ = Zepto);
(function($){
  var $$ = $.qsa, handlers = {}, _zid = 1;
  function zid(element) {
    return element._zid || (element._zid = _zid++);
  }
  function findHandlers(element, event, fn, selector) {
    event = parse(event);
    if (event.ns) var matcher = matcherFor(event.ns);
    return (handlers[zid(element)] || []).filter(function(handler) {
      return handler
        && (!event.e  || handler.e == event.e)
        && (!event.ns || matcher.test(handler.ns))
        && (!fn       || handler.fn == fn)
        && (!selector || handler.sel == selector);
    });
  }
  function parse(event) {
    var parts = ('' + event).split('.');
    return {e: parts[0], ns: parts.slice(1).sort().join(' ')};
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
  }

  function add(element, events, fn, selector, delegate){
    var id = zid(element), set = (handlers[id] || (handlers[id] = []));
    events.split(/\s/).forEach(function(event){
      var callback = delegate || fn;
      var proxyfn = function(event) { return callback(event, event.data) };
      var handler = $.extend(parse(event), {fn: fn, proxy: proxyfn, sel: selector, del: delegate, i: set.length});
      set.push(handler);
      element.addEventListener(handler.e, proxyfn, false);
    });
  }
  function remove(element, events, fn, selector){
    var id = zid(element);
    (events || '').split(/\s/).forEach(function(event){
      findHandlers(element, event, fn, selector).forEach(function(handler){
        delete handlers[id][handler.i];
        element.removeEventListener(handler.e, handler.proxy, false);
      });
    });
  }

  $.event = { add: add, remove: remove }

  $.fn.bind = function(event, callback){
    return this.each(function(){
      add(this, event, callback);
    });
  };
  $.fn.unbind = function(event, callback){
    return this.each(function(){
      remove(this, event, callback);
    });
  };
  $.fn.one = function(event, callback){
    return this.each(function(){
      var self = this;
      add(this, event, function wrapper(){
        callback();
        remove(self, event, arguments.callee);
      });
    });
  };

  var eventMethods = ['preventDefault', 'stopImmediatePropagation', 'stopPropagation'];
  function createProxy(event) {
    var proxy = $.extend({originalEvent: event}, event);
    eventMethods.forEach(function(key) {
      proxy[key] = function() {return event[key].apply(event, arguments)};
    });
    return proxy;
  }

  $.fn.delegate = function(selector, event, callback){
    return this.each(function(i, element){
      add(element, event, callback, selector, function(e, data){
        var target = e.target, nodes = $$(element, selector);

        //while (target && nodes.indexOf(target) < 0)target = target.parentNode;
        if (target && !(target === element) && !(target === document)) {
          callback.call(target, $.extend(createProxy(e), {
            currentTarget: target, liveFired: element
          }), data);
        }
      });
    });
  };
  $.fn.undelegate = function(selector, event, callback){
    return this.each(function(){
      remove(this, event, callback, selector);
    });
  }

  $.fn.live = function(event, callback){
    $(document.body).delegate(this.selector, event, callback);
    return this;
  };
  $.fn.die = function(event, callback){
    $(document.body).undelegate(this.selector, event, callback);
    return this;
  };

  $.fn.trigger = function(event, data){
    return this.each(function(){
      var e = document.createEvent('Events');
      e.initEvent(event, true, true)
      e.data = data;
      this.dispatchEvent(e);
    });
  };
})(Zepto);
(function($){
  function detect(ua){
    var ua = ua, os = {},
      android = ua.match(/(Android)\s+([\d.]+)/),
      iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/),
      ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
      webos = ua.match(/(webOS)\/([\d.]+)/),
      blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/);
    if (android) os.android = true, os.version = android[2];
    if (iphone) os.ios = true, os.version = iphone[2].replace(/_/g, '.'), os.iphone = true;
    if (ipad) os.ios = true, os.version = ipad[2].replace(/_/g, '.'), os.ipad = true;
    if (webos) os.webos = true, os.version = webos[2];
    if (blackberry) os.blackberry = true, os.version = blackberry[2];
    return os;
  }
  $.os = detect(navigator.userAgent);
  $.__detect = detect;

  var v = navigator.userAgent.match(/WebKit\/([\d.]+)/);
  $.browser = v ? { webkit: true, version: v[1] } : { webkit: false };
})(Zepto);
(function($, undefined){
  $.fn.anim = function(properties, duration, ease, callback){
    var transforms = [], opacity, key;
    for (key in properties)
      if (key === 'opacity') opacity = properties[key];
      else transforms.push(key + '(' + properties[key] + ')');

    $.isFunction(callback) && this.one('webkitTransitionEnd', callback);

    return this.css({
      '-webkit-transition': 'all ' + (duration !== undefined ? duration : 0.5) + 's ' + (ease || ''),
      '-webkit-transform': transforms.join(' '),
      opacity: opacity
    });
  }
})(Zepto);
(function($){
  var jsonpID = 0,
      isObject = $.isObject,
      key;

  function empty() {}

  $.ajaxJSONP = function(options){
    var jsonpString = 'jsonp' + ++jsonpID,
        script = document.createElement('script');
    window[jsonpString] = function(data){
      options.success(data);
      delete window[jsonpString];
    };
    script.src = options.url.replace(/=\?/, '=' + jsonpString);
    $('head').append(script);
  };

  $.ajaxSettings = {
    type: 'GET',
    beforeSend: empty, success: empty, error: empty, complete: empty,
    accepts: {
      script: 'text/javascript, application/javascript',
      json:   'application/json',
      xml:    'application/xml, text/xml',
      html:   'text/html',
      text:   'text/plain'
    }
  };

  $.ajax = function(options){
    options = options || {};
    var settings = $.extend({}, options);
    for (key in $.ajaxSettings) if (!settings[key]) settings[key] = $.ajaxSettings[key];

    if (/=\?/.test(settings.url)) return $.ajaxJSONP(settings);

    if (!settings.url) settings.url = window.location.toString();
    if (settings.data && !settings.contentType) settings.contentType = 'application/x-www-form-urlencoded';
    if (isObject(settings.data)) {
      if (settings.contentType == 'application/x-www-form-urlencoded')
        settings.data = $.param(settings.data)
      else if (settings.contentType == 'application/json')
        settings.data = JSON.stringify(settings.data);
    }

    if (settings.type.match(/get/i) && settings.data) {
      var queryString = settings.data;
      if (settings.url.match(/\?.*=/)) {
        queryString = '&' + queryString;
      } else if (queryString[0] != '?') {
        queryString = '?' + queryString;
      }
      settings.url += queryString;
    }

    var mime = settings.accepts[settings.dataType],
        xhr = new XMLHttpRequest();

    settings.headers = $.extend({'X-Requested-With': 'XMLHttpRequest'}, settings.headers || {});
    if (mime) settings.headers['Accept'] = mime;

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        var result, error = false;
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 0) {
          if (mime == 'application/json') {
            try { result = JSON.parse(xhr.responseText); }
            catch (e) { error = e; }
          }
          else result = xhr.responseText;
          if (error) settings.error(xhr, 'parsererror', error);
          else settings.success(result, 'success', xhr);
        } else {
          error = true;
          settings.error(xhr, 'error');
        }
        settings.complete(xhr, error ? 'error' : 'success');
      }
    };

    xhr.open(settings.type, settings.url, true);
    if (settings.beforeSend(xhr, settings) === false) {
      xhr.abort();
      return false;
    }

    // Apply custom fields if provided
    if (settings.xhrFields)
      for (var i in settings.xhrFields) xhr[i] = settings.xhrFields[i];

    if (settings.contentType) settings.headers['Content-Type'] = settings.contentType;
    for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name]);
    xhr.send(settings.data);

    return xhr;
  };

  $.get = function(url, success){ $.ajax({ url: url, success: success }) };
  $.post = function(url, data, success, dataType){
    if ($.isFunction(data)) dataType = dataType || success, success = data, data = null;
    $.ajax({ type: 'POST', url: url, data: data, success: success, dataType: dataType });
  };
  $.getJSON = function(url, success){ $.ajax({ url: url, success: success, dataType: 'json' }) };

  $.fn.load = function(url, success){
    if (!this.length) return this;
    var self = this, parts = url.split(/\s/), selector;
    if (parts.length > 1) url = parts[0], selector = parts[1];
    $.get(url, function(response){
      self.html(selector ?
        $(document.createElement('div')).html(response).find(selector).html()
        : response);
      success && success();
    });
    return this;
  };

  $.param = function(obj, v){
    var result = [], add = function(key, value){
      result.push(encodeURIComponent(v ? v + '[' + key + ']' : key)
        + '=' + encodeURIComponent(value));
      },
      isObjArray = $.isArray(obj);

    for(key in obj)
      if(isObject(obj[key]))
        result.push($.param(obj[key], (v ? v + '[' + key + ']' : key)));
      else
        add(isObjArray ? '' : key, obj[key]);

    return result.join('&').replace('%20', '+');
  };
})(Zepto);
(function($){
  var touch = {}, touchTimeout;

  function parentIfText(node){
    return 'tagName' in node ? node : node.parentNode;
  }

  function swipeDirection(x1, x2, y1, y2){
    var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2);
    if (xDelta >= yDelta) {
      return (x1 - x2 > 0 ? 'Left' : 'Right');
    } else {
      return (y1 - y2 > 0 ? 'Up' : 'Down');
    }
  }

  $(document).ready(function(){
    $(document.body).bind('touchstart', function(e){
      var now = Date.now(), delta = now - (touch.last || now);
      touch.target = parentIfText(e.touches[0].target);
      touchTimeout && clearTimeout(touchTimeout);
      touch.x1 = e.touches[0].pageX;
      touch.y1 = e.touches[0].pageY;
      if (delta > 0 && delta <= 250) touch.isDoubleTap = true;
      touch.last = now;
    }).bind('touchmove', function(e){
      touch.x2 = e.touches[0].pageX;
      touch.y2 = e.touches[0].pageY;
    }).bind('touchend', function(e){
      if (touch.isDoubleTap) {
        $(touch.target).trigger('doubleTap');
        touch = {};
      } else if (touch.x2 > 0 || touch.y2 > 0) {
        (Math.abs(touch.x1 - touch.x2) > 30 || Math.abs(touch.y1 - touch.y2) > 30)  &&
          $(touch.target).trigger('swipe') &&
          $(touch.target).trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
        touch.x1 = touch.x2 = touch.y1 = touch.y2 = touch.last = 0;
      } else if ('last' in touch) {
        touchTimeout = setTimeout(function(){
          touchTimeout = null;
          $(touch.target).trigger('tap')
          touch = {};
        }, 250);
      }
    }).bind('touchcancel', function(){ touch = {} });
  });

  ['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap'].forEach(function(m){
    $.fn[m] = function(callback){ return this.bind(m, callback) }
  });
})(Zepto);


return Zepto;
}
)();
 };

Joshfire.definedModules['joshfire/input'] = function() { return (
function(Class) {

  return Class( /** @lends input */ {

    /**
    * @class Abstract class for inputs
    * @constructs
    * @param {app} app Reference to the app.
    */
    __constructor: function(app) {
      this.app = app;
    },

    /**
    * Performs setup. To be overriden in the input class
    * @methodOf input.prototype
    * @param {Function} callbackOnReady Callback when ready to accept.
    */
    setup: function(callbackOnReady) {
      // some inputs can have asynchronous initialization (network connection, USB ...)
      callbackOnReady(null);
    }
  });
}
)(Joshfire.loadModule('joshfire/class'));
 };

Joshfire.definedModules['joshfire/adapters/ios/inputs/touch'] = function() { return (
function(Input, Class, $) {

  /**
  * @class Input interface for touch events on iOS
  * @name adapters_ios_inputs_touch
  * @augments input
  */
  return Class(Input, {

    setup: function(callback) {
      var self = this;

      function hasTouchEvent() {
        try {
          document.createEvent('TouchEvent');
          return true;
        } catch (e) {
          return false;
        }
      }

      // When using iScroll, touchstarts are first handled here but passed because of elt.hasScroller.
      // Then come back as "click" events that iScroll generates if the touch was a tap and not a swipe
      // In this case it is only then than we treat them as an input
      
      // The case !hasTouchEvent() helps for browser testing only.
      
      $(window).live(hasTouchEvent() ? 'touchstart click tap MozTouchDown' : 'mousedown click', function(e) {
        for (var target = this; target && target != document; target = target.parentNode) {
          if ($(target).attr('data-josh-ui-path')) {
            var elt = self.app.ui.element($(target).attr('data-josh-ui-path'));
            if ((!elt.hasScroller && e.type!="click" /* && e.type!='touchstart'*/) || (e.type=="click" && elt.hasScroller)) {
             elt.publish('input', ['enter', $(target).attr('data-josh-grid-id'), this], true);
            }
            break;
          }
        }
      });
      
      //Swipe(s) only for touch devices
      if (hasTouchEvent){
        $(window).live('swipeLeft swipeRight swipeUp swipeDown', function (e){
          for (var target = this; target && target != document; target = target.parentNode) {
            if ($(target).attr('data-josh-ui-path')) {
              var elt = self.app.ui.element($(target).attr('data-josh-ui-path'));
              elt.publish('swipe', [e.type.replace(/swipe/,'').toLowerCase(), $(target).attr('data-josh-grid-id'), this], true);
              break;
            }
          }
        });
        
      }

      callback(null);
    }
  });

}
)(Joshfire.loadModule('joshfire/input'),Joshfire.loadModule('joshfire/class'),Joshfire.loadModule('joshfire/vendor/zepto'));
 };

Joshfire.definedModules['joshfire/adapters/ios/app'] = function() { return (
function(Class, App, J, _, $, Touch) {

  Joshfire.getScript = function() {/*not implemented*/};


  return Class(App,
      /**
      * @lends adapters_ios_app.prototype
      */
      {
        getDefaultOptions: function() {
          return _.extend(this.__super(), {
            inputs: [Touch],
            autoInsert: true,
            parentElement: document.body
          });
        },

        /**
        * @class App implementation for iOS
        * @constructs
        * @augments app
        */
        __constructor: function(options) {
          var self = this;

          this.options = _.extend(this.getDefaultOptions(), options || {});

          if (self.options.autoInsert) {
            self.subscribe('ready', function() {
              J.onReady(function() {
                self.insert(self.options.parentElement);
              });
            });
          }

          this.__super(options);

        },

        /**
        * Inserts the app in the DOM
        * @function
        */
        insert: function(htmlId) {
          var self = this;

          if (_.isString(htmlId)) {
            this.baseHtmlEl = document.getElementById(htmlId);
          } else {
            this.baseHtmlEl = htmlId;
          }

          this.publish('beforeInsert', [this.baseHtmlEl], true);

          var rootElement = this.ui.element('');
          rootElement.insert(this.baseHtmlEl);

          this.publish('afterInsert');

        }
      });

}
)(Joshfire.loadModule('joshfire/class'),Joshfire.loadModule('joshfire/app'),Joshfire.loadModule('joshfire/main'),Joshfire.loadModule('joshfire/vendor/underscore'),Joshfire.loadModule('joshfire/vendor/zepto'),Joshfire.loadModule('joshfire/adapters/ios/inputs/touch'));
 };

Joshfire.definedModules['joshfire/utils/memorystorage'] = function() { return (
function() {

  //memory cached
  var cache = {};
  
  return {
    set:function(key,val) {
      cache[key]=val;
    },
    get:function(key) {
      return cache[key];
    },
    clear:function() {
      cache = {};
    },
    remove:function(key) {
      delete cache[key];
    },
    disabled:false
  };

}
)();
 };

Joshfire.definedModules['joshfire/utils/pool'] = function() { return (
function() {


  var PriorityQueue = function(size) {
    var me = {},
        slots, i, total = null;

    // initialize arrays to hold queue elements
    size = Math.max(+size | 0, 1);
    slots = [];
    for (i = 0; i < size; i += 1) {
      slots.push([]);
    }

    me.size = function() {
                var i;
                if (total === null) {
        total = 0;
        for (i = 0; i < size; i += 1) {
          total += slots[i].length;
        }
                }
                return total;
    };


    me.enqueue = function(obj, priority) {
      var priorityOrig;

      // Convert to integer with a default value of 0.
      priority = priority && +priority | 0 || 0;

      // Clear cache for total.
      total = null;
      if (priority) {
        priorityOrig = priority;
        if (priority < 0 || priority >= size) {
          priority = (size - 1);
          // put obj at the end of the line
          console.error('invalid priority: ' + priorityOrig + ' must be between 0 and ' + priority);
        }
      }

      slots[priority].push(obj);
    };


    me.dequeue = function(callback) {
      var obj = null,
                    i, sl = slots.length;

      // Clear cache for total.
      total = null;
      for (i = 0; i < sl; i += 1) {
        if (slots[i].length) {
          obj = slots[i].shift();
          break;
        }
      }
      return obj;
    };

    return me;
  };

  /**
  * Generate an Object pool with a specified `factory`.
  * @class Priority-aware resource pool
  * @name utils_pool
  * @param {Object} factory Factory to be used for generating and destorying the items.
  * @param {String} factory.name
  *   Name of the factory. Serves only logging purposes.
  * @param {Function} factory.create
  *   Should create the item to be acquired,
  *   and call it's first callback argument with the generated item as it's argument.
  * @param {Function} factory.destroy
  *   Should gently close any resources that the item is using.
  *   Called before the items is destroyed.
  * @param {Number} factory.max
  *   Maximum numnber of items that can exist at the same time.
  *   Any further acquire requests will be pushed to the waiting list.
  * @param {Number} factory.idleTimeoutMillis
  *   Delay in milliseconds after the idle items in the pool will be destroyed.
  *   And idle item is that is not acquired yet. Waiting items doesn't count here.
  * @param {Number} factory.reapIntervalMillis
  *   Cleanup is scheduled in every `factory.reapIntervalMillis` milliseconds.
  * @param {Boolean|Function} factory.log
  *   Whether the pool should log activity. If function is specified,
  *   that will be used instead.
  * @param {Number} factory.priorityRange
  *   The range from 1 to be treated as a valid priority.
  *
  * @return {Object} An Object pool that works with the supplied `factory`.
  */
  var Pool = function(factory) {
    var me = {},



        idleTimeoutMillis = factory.idleTimeoutMillis || 30000,
                reapInterval = factory.reapIntervalMillis || 1000,



                availableObjects = [],
                waitingClients = new PriorityQueue(factory.priorityRange || 1),
                count = 0,
                removeIdleScheduled = false,

                // Prepare a logger function.
                log = factory.log ? (typeof factory.log === 'function' ? factory.log :
                /**
                * @function
                * @param {Object} string
                */

                function(str) {
          console.log('pool ' + factory.name + ' - ' + str);
                }) : function() {};

    factory.max = Math.max(factory.max, 1);

    /**
    * Request the client to be destroyed. The factory's destroy handler
    * will also be called.
    *
    * @param {Object} obj The acquired item to be destoyed.
    */

    function destroy(obj) {
      count -= 1;
      factory.destroy(obj);
    }

    /**
    * Checks and removes the available (idle) clients that has timed out.
    */
    function removeIdle() {
      var toKeep = [],
          now = new Date().getTime(),
                    i, al, timeout;

      removeIdleScheduled = false;

      // Go through the available (idle) items,
      // check if they have timed out
      for (i = 0, al = availableObjects.length; i < al; i += 1) {
        timeout = availableObjects[i].timeout;
        if (now < timeout) {
          // Client hasn't timed out, so keep it.
          toKeep.push(availableObjects[i]);
        } else {
          // The client timed out, call it's destroyer.
          log('removeIdle() destroying obj - now:' + now + ' timeout:' + timeout);
          destroy(availableObjects[i].obj);
        }
      }

      // Replace the available items with the ones to keep.
      availableObjects = toKeep;
      al = availableObjects.length;

      if (al > 0) {
        log('availableObjects.length=' + al);
        scheduleRemoveIdle();
      } else {
        log('removeIdle() all objects removed');
      }
    }


    /**
    * Schedule removal of idle items in the pool.
    *
    * More schedules cannot run concurrently.
    */

    function scheduleRemoveIdle() {
      if (!removeIdleScheduled) {
        removeIdleScheduled = true;
        setTimeout(removeIdle, reapInterval);
      }
    }

    /**
    * Try to get a new client to work, and clean up pool unused (idle) items.
    *
    *  - If there are available clients waiting shift the first one out (LIFO),
    *    and call it's callback.
    *  - If there are no waiting clients, try to create one if it wont exciede
    *    the maximum number of clients.
    *  - If creating a new client would exciede the maximum, add the client to
    *    the wait list.
    */
    function dispense() {
      var obj = null,
                    waitingCount = waitingClients.size();
      log('dispense() clients=' + waitingCount + ' available=' + availableObjects.length);
      if (waitingCount > 0) {
        if (availableObjects.length > 0) {
          log('dispense() - reusing obj');
          objWithTimeout = availableObjects.shift();
          waitingClients.dequeue()(objWithTimeout.obj);
        } else if (count < factory.max) {
          count += 1;
          log('dispense() - creating obj - count=' + count);
          factory.create(function(obj) {
            var cb = waitingClients.dequeue();
            if (cb) {
              cb(obj);
            } else {
              me.release(obj);
            }
          });
        }
      }
    }

    /**
    * Request a new client. The callback will be called,
    * when a new client will be availabe, passing the client to it.
    * @methodOf utils_pool#
    * @name acquire
    * @param {Function} callback Callback function to be called after the acquire is successful. The function will recieve the acquired item as the first parameter.
    * @param {Number} [priority] Integer between 0 and (priorityRange - 1).  Specifies the priority of the caller if there are no available resources. Lower numbers mean higher priority.
    */
    me.acquire = function(callback, priority) {
      waitingClients.enqueue(callback, priority);
      dispense();
    };

    /**
    * @methodOf utils_pool#
    * @name borrow
    * @param {Function} callback
    * @param Object
    */
    me.borrow = function(callback, priority) {
      log('borrow() is deprecated. use acquire() instead');
      me.acquire(callback, priority);
    };

    /**
    * Return the client to the pool, in case it is no longer required.
    * @methodOf utils_pool#
    * @name release
    * @param {Object} obj The acquired object to be put back to the pool.
    */
    me.release = function(obj) {
      //log("return to pool");
      var objWithTimeout = {
        obj: obj,
        timeout: (new Date().getTime() + idleTimeoutMillis)
      };
      availableObjects.push(objWithTimeout);
      log('timeout: ' + objWithTimeout.timeout);
      dispense();
      scheduleRemoveIdle();
    };

    /**
    * @methodOf utils_pool#
    * @name returnToPool
    * @param {Object} obj
    */
    me.returnToPool = function(obj) {
      log('returnToPool() is deprecated. use release() instead');
      me.release(obj);
    };

    return me;
  };


  return Pool;


}
)();
 };

Joshfire.definedModules['joshfire/utils/datasource'] = function() { return (
function(J,MemoryCache, Class, Pool, _) {

  return Class(
      /**
      * @lends utils_datasource.prototype
      */
      {
        /**
        * @constructs
        * @class A Datasource implementation
        * @param {Object} options Options hash.
        */
        __constructor: function(options) {
          var self = this;
          
          this.options = _.extend({
            'cacheApi':MemoryCache
          },options);
          
          this.pool = new Pool({
            'name': 'joshfire',
            //idleTimeoutMillis : 30000,
            //priorityRange : 3,
            'max': this.options.concurrency || 1,
            'create': function(callback) {
              callback();
            },
            'destroy': function() {}
          });

        },

        /**
        * @param args.cache {String}
        * @param args.url
        * @param args.dataType
        * @param args.data
        * @param args.type
        * @param args.username
        * @param args.password
        * @param args.success {function} will be called back when cached response has been retrieved.
        * @return {boolean}
        */
        testCache: function(args,callback) {
          //var hash = this.hash(args);
          //            console.warn("test cache",this.hash(args),args.cache,this.cache[hash],this.cache,args.cache*1000,(new Date()))
          if (args.cache && this.options.cacheApi && !this.options.cacheApi.disabled) {
            var hash = this.hash(args);
            var cached = this.options.cacheApi.get(hash);
            
            if (cached && (cached.time + args.cache * 1000) > +(new Date())) {

              callback(null, JSON.parse(JSON.stringify(cached.result)));
              return true;
            }
          }
          return false;
        },

        /**
        * @function
        * @param [args.cache=true] {boolean} set to false to disable automatic browser (or other interpreter) caching.
        * @param [args.data] {Object} provide a key/value pair object and it will append that to the URL if args.method is GET, or in the body of the query if args.method is POST.
        * @param [args.headers] {Object} Key/value pair with additional headers to add to the XHR.
        * @param [args.timeout] {Number} defines the timeout for this query.
        * @param [args.type] {String} POST, GET, HEAD, PUT, DELETE ...
        * @param [args.url] {String} the server URL.
        * @param callback {function} that function will be called after the query has been made. If the first argument !== null, there was an error.
        */
        request: function(args, callback) {
          var self = this;

          if (!this.testCache(args, callback)) {

            var params = _.extend({}, args);

            var cb = function(error, data) {
              self.pool.release();

              if (!callback) return;

              if (error) return callback(error);

              if (args.cache && self.options.cacheApi && !self.options.cacheApi.disabled) {
                try {
                  self.options.cacheApi.set(self.hash(args),{
                    'result': JSON.parse(JSON.stringify(data)),
                    'time': +(new Date())
                  });
                } catch (e) {
                  //No more space? Error? Reset to be sure.
                  self.options.cacheApi.clear();
                }
              }
              callback(null, data);
            };

            var makeTheQuery = function() {
              //Been cached in the meantime?
              if (!self.testCache(args, callback)) {
                return self._request(params, cb);
              }
            };

            this.pool.acquire(makeTheQuery);

          }
        },

        /**
        * @private
        * @param {Object} params
        */
        _request: function(params, callback) {
          params.error('no backend included!');
        },

        /**
        * @private
        * use to generate a unique hash from the data
        * @param args.url
        * @param args.dataType
        * @param args.data
        * @param args.type
        * @param args.username
        * @param args.password
        * @return {string}
        */
        hash: function(args) {
          return JSON.stringify([args.url, args.dataType, args.data, args.type, args.username, args.password]);
        }

      });
}
)(Joshfire.loadModule('joshfire/main'),Joshfire.loadModule('joshfire/utils/memorystorage'),Joshfire.loadModule('joshfire/class'),Joshfire.loadModule('joshfire/utils/pool'),Joshfire.loadModule('joshfire/vendor/underscore'));
 };

Joshfire.definedModules['joshfire/adapters/ios/utils/datasource'] = function() { return (
function(DataSource, Class, $,_) {

  return Class(DataSource, {

    /**
    * @function
    * @param {Object} var
    */
    _request: function(params, callback) {

      if (params.dataType == 'jsonp') {
        // params.dataType='json';

        if (!params.url.match(/\?.*=/)) {
          params.url += '?callback=?';
        }
        else {
          params.url += '&callback=?&';
        }
        _.each(params.data, function(val,key) {
          params.url += '&' + key + '=' + val;
        });
      }

      params.success = function(ret, code) {
        callback(null, ret);
      };

      params.error = function(err) {
        callback(err);
      };

      return $.ajax(params);
    }

  });


}
)(Joshfire.loadModule('joshfire/utils/datasource'),Joshfire.loadModule('joshfire/class'),Joshfire.loadModule('joshfire/vendor/zepto'),Joshfire.loadModule('joshfire/vendor/underscore'));
 };

Joshfire.definedModules['src/api/ted'] = function() { return (
function(DataSource,_) {
  var datasource = new DataSource(),
  
  // This API is also open source on github : http://github.com/joshfire/ted-api
  // It is only temporary since TED is supposed to release an API mid-2011.
  APIROOT_TED = 'http://ted-api.appspot.com/rest/v1/json/';

  var urlserialize = function(obj) {
    var str = [];
    for (var p in obj) {
      str.push(p + '=' + encodeURIComponent(obj[p]));
    }
    return str.join('&');
  };

  var API = {
    query: function(url,callback) {
      datasource.request({
        url: APIROOT_TED+url, 
        dataType: 'jsonp',
        cache: 'no',
        jsonp: 'callback'
      },
      function (error, json) {
        if (error) {
          return callback(error, null);
        }
        return callback(null, json);
      });
    },

    completeTalks: function(talks, callback) {

      API.query('Talker?page_size=200&fin_key=' + encodeURIComponent(_.pluck(talks, 'talker').join(',')), function(error, json) {
        if (error) return callback(error);
        if (json.list.Talker && !_.isArray(json.list.Talker))
          json.list.Talker = [json.list.Talker];
        _.each(talks,function(talk) {
          _.each(json.list.Talker, function(talker) {
            if (talk.talker == talker.key) {
              talk.talker = talker;
            }
          });
        });
        callback(null,talks);
      });
    },
    
    
    getTalks:function(query,callback) {
      
      var qs = {
        'page_size': query.limit,
        'offset': query.skip
      };

      if (query.filter) {
        if (query.filter.theme) {
          //First fetch TalkTheme ids, then ask for these ids.
          API.query('TalkTheme?' + urlserialize(qs) + '&feq_theme=' + encodeURIComponent(query.filter.theme), function(error, json) {
            if (error) return callback(error);
            delete query.filter.theme;

            query.filter.id = (json.list.TalkTheme ? (_.isArray(json.list.TalkTheme) ? _.pluck(json.list.TalkTheme, 'talk') : json.list.TalkTheme.talk) : null);
            API.getTalks(query, callback);
          });
          return;
        }

        if (query.filter.id) {
          if (_.isArray(query.filter.id)) {
            qs['fin_key'] = query.filter.id.join(',');
          } else {
            qs['feq_key'] = query.filter.id;
          }
        }
      }

      if (query.sort && query.sort.date) {
        //TODO are talks always released in order?
        qs['ordering'] = (query.sort.date == -1 ? '-' : '') + 'tedid';
      }

      //Send the query
      API.query('Talk?' + urlserialize(qs), function(error, json) {
        if (error) return callback(error);
        API.completeTalks(_.isArray(json.list.Talk) ? json.list.Talk : [json.list.Talk], function(error2, talks) {
          //console.warn('got talks', talks);
          if (error2) return callback(error);
          //Format talks for the tree
          callback(null, _.map(talks, function(item) {
            return {
              id: item.tedid,
              label: ((item.name.indexOf(': ') == -1) ? item.name : item.name.substring(item.name.indexOf(': ') + 2)),
              summary: item.shortsummary,
              image: item.image,
              talker: item.talker,
              key: item.key,
              duration: item.duration_postad
            };
          }));
        });
      });
      
    },
    
    getThemes:function(query,callback) {
      
      API.query('Theme?page_size=' + query.limit + '&offset=' + query.skip, function(error, json) {
        if (error) return callback(error);
        childCallback(null, _.map(json.list.Theme, function(theme) {

          return {
            'id': theme.key,
            'label': theme.name,
            'image': theme.image,
            
          };
        }), {'cache': 3600*24});
      });
      
    },

    getVideo: function(talk, callback){
      API.query('Video?feq_talk=' + talk, function(error, json) {
        if (error) return callback(error);
        callback(null, json.list.Video);
      });
    }
  };
  
  return API;
}
)(Joshfire.loadModule('joshfire/adapters/ios/utils/datasource'),Joshfire.loadModule('joshfire/vendor/underscore'));
 };

Joshfire.definedModules['src/api/tedx'] = function() { return (
function(DataSource,_) {
  
  var datasource = new DataSource();
  
  return {

    getTEDxList: function(query, callback) {
      
      var tedxid=false;
      if (query.filter && query.filter.id) {
        tedxid=query.filter.id;
      }
      
      datasource.request({
        
        // Email sylvain _at_ joshfire.com to get an invite on this spreadsheet to add your TEDx events.
        "url":"https://spreadsheets.google.com/feeds/list/0ArnpnObxnz4RdHJhSVlURUlFdk9pc09jOHkxLWRHa1E/od6/public/values?hl=fr&alt=json-in-script",
        "dataType":"jsonp",
        "cache":3600
      },function(err,data) {
        if (err) return callback(err);
      
        //TODO manage query.limit & query.skip

        var matches = [];
        _.each(data.feed.entry,function(tedx,i) {
          
          if (tedx.gsx$tedxname.$t==tedxid || !tedxid) {
            
            // Show TEDx locations when in global mode
            if (!tedxid) {
              var eventlabel = tedx.gsx$formattedname.$t+" "+tedx.gsx$eventname.$t;
            } else {
              var eventlabel = tedx.gsx$eventname.$t;
            }
            
            var playlistId = tedx.gsx$youtubeplaylist.$t;
            
            var wasAnUrl = playlistId.match(/list\=PL([0-9A-Z]+)/);
            if (wasAnUrl) {
              playlistId = wasAnUrl[1];
            }
            var wasAnUrl = playlistId.match(/view_play_list\?p\=([0-9A-Z]+)/);
            if (wasAnUrl) {
              playlistId = wasAnUrl[1];
            }
            
            matches.push({
              "id":i,
              "image":tedx.gsx$eventimage.$t,
              "label":eventlabel,
              "meta":{
                "title":tedx.gsx$formattedname.$t,
                "website":tedx.gsx$website.$t,
                "twitter":tedx.gsx$twitteraccount.$t,
                "youtube":playlistId
              }
            });
          }
        });
        
        callback(null,matches);
      
        
      });
      
    },
    
    // Beautify the labels from YouTube
    formatTalkDataFromYoutube:function(talk) {
    
      var label = talk.label;
    
      //strip "TEDx XYZ 20xx"
      label = label.replace(/tedx( )?([a-z0-9]+)( 20[0-9]{2})?/ig,"");
    
      //strip dates
      label = label.replace(/[0-9]{2,4}\/[0-9]{2}\/[0-9]{2,4}/g,"");
    
      //Trim
      label = label.replace(/^[ \-\:]+/,"");
      label = label.replace(/[ \-\:]+$/,"");
    
      //Try to extract talker name, before the first " - "
      if (label.indexOf(" - ")>0) {
        talk.talker = {name:label.substring(0,label.indexOf(" - "))};
        label = label.substring(label.indexOf(" - ")+3);
      }
    
      //Trim again
      label = label.replace(/^[ \-\:]+/,"");
      label = label.replace(/[ \-\:]+$/,"");
    
    
      talk.label = label;


      /* Dirty fixes for apple commercial */
      //Fix Vinvin
      talk.summary = talk.summary.replace(/Vinvin \(alias Cyrille Delasteyrie\)/, 'Cyrille de Lasteyrie, alias Vinvin, ');
      
      //Fix order by
      var weights = {
          'Vinvin':1,
          'Jean-Louis Servan-Schreiber':2,
          'Bruno Giussani':3,
          'Etienne Klein':4,
          'Etienne Parizot':5,
          'Djazia Satour':6
        };
        talk.weight = weights[talk.talker ? talk.talker.name : talk.label]
      return talk;
    
    
    }
  };
}
)(Joshfire.loadModule('joshfire/adapters/ios/utils/datasource'),Joshfire.loadModule('joshfire/vendor/underscore'));
 };

Joshfire.definedModules['src/api/youtube'] = function() { return (
function(Class,DataSource) {
  
  
  return Class({

      __constructor:function() {
          this.datasource = new DataSource();
      },

      request:function(url,callback) {
          return this.datasource.request({
              "url":"http://gdata.youtube.com/feeds/api/"+url,
              "dataType":"jsonp",
              "cache":true
          },function(err,data) {
              callback(err,data);
          });
      },
      
      formatVideos:function(videos) {
        //Map YouTube's data structure to a simplier JSON array
         for (var i = 0, l = videos.length; i < l; i++) {
           videos[i] = {
             'id': videos[i].id.$t.replace(/^.*\//, ''),
             'type': 'video',
             'source':'youtube',
             'summary': videos[i].content.$t,
             'label': videos[i].title.$t,
             'image': videos[i].media$group.media$thumbnail ? videos[i].media$group.media$thumbnail[0].url : '',
             'url': videos[i].link[0].href.replace('http://www.youtube.com/watch?v=', '').replace(/\&.*$/, '')
           };
         }
         
         return videos;
        
      },

      getPlaylistVideos:function(playlistId,callback) {
        var self = this;
        
        this.request("playlists/"+playlistId+"?alt=json-in-script&max-results=50",function(error,data) { //start-index
          if (error) return callback(error,data);
          
          callback(null, self.formatVideos(data.feed.entry));
        });
      },
       
       getUserVideos:function(userName,callback) {
         var self = this;
         
         this.request('/users/' + userName + '/uploads?alt=json-in-script&max-results=50',function(error,data) {
           if (error) return callback(error,data);

           callback(null, self.formatVideos(data.feed.entry));
         });

       } 

  
     });
     
}
)(Joshfire.loadModule('joshfire/class'),Joshfire.loadModule('joshfire/adapters/ios/utils/datasource'));
 };

Joshfire.definedModules['src/api/twitter'] = function() { return (
function(Class,DataSource) {
  
  
  return Class({

      __constructor:function() {
          this.datasource = new DataSource();
      },

      request:function(url,callback) {
          return this.datasource.request({
              "url":url,
              "dataType":"jsonp",
              "cache":true
          },function(err,data) {
              callback(err,data);
          });
      },
      
      tweetsFromUser:function(user,query,callback) {
        
        this.request("http://twitter.com/status/user_timeline/"+user+".json?count="+query.limit+"&page="+(query.skip?parseInt(query.limit/query.skip)+1:1),callback);
        
        
        //this.request("http://search.twitter.com/search.json?q=from%3A"+username,callback);
        
      }
      
      
  });
     
}
)(Joshfire.loadModule('joshfire/class'),Joshfire.loadModule('joshfire/adapters/ios/utils/datasource'));
 };

Joshfire.definedModules['src/tree.data'] = function() { return (
function(Class, DataTree, _, TEDAPI,TEDxAPI, YoutubeAPI, TwitterAPI, DataSource) {

  var youtubeAPI = new YoutubeAPI();
  
  var twitterAPI = new TwitterAPI();
  
  var ds = new DataSource();
  
  return Class(DataTree, {
    buildTree: function() {
      var self = this;
      var app = this.app;
      var me = app.data;

      return [
      {
        
        id: 'ted',
        children:[{
          
          id: 'themes',
          children: function(query, callback) {
            TEDAPI.getThemes(query,function(err,themes) {
              if (err) return callback(err,themes);
              
              callback(null,_.map(themes,function(theme) {
                
                theme.children = function(q, cb) {
                  query['filter'] = {'theme': theme.id};
                  me.fetch('/ted/talks/all/', q, function(e, data) {
                    cb(e, data, {'cache': 3600});
                  });
                };
                
                return theme;
                
              }), {'cache': 3600*24});
              
            });
          }
          
        },{
          
          id: 'talks',
          children: [
            {
              'id': 'latest',
              'children': function(query, cb) {
                query['sort'] = {'date': -1};
                me.fetch('/ted/talks/all/', query, function(err,data) {
                  cb(err,data,{"cache":3600});
                });
              }
            },
            {
              id: 'favorites',
              label:'Favorites',
              children:function(query, cb){
                if(!app.userSession || !app.userSession.mytv || !app.userSession.mytv.favorites ||!app.data.get('/ted/talks/favorites/') ||!app.data.get('/ted/talks/favorites/').length){
                  return cb('No favorites yet', null);
                }
                cb(null, app.data.get('/ted/talks/favorites/'));
              }
            },
            {
              'id': 'all',
              'children': function(query, callback) {
                TEDAPI.getTalks(query,callback);
              }
            }
          ]
        }]
        
      },

      {
        id: 'twitter',
        children:function(query,callback) {
          twitterAPI.tweetsFromUser(app.tedxmeta.twitter,query,callback);
        }
      },
      
      {
        id: 'tedx',
        children:function(query,callback) {
          
          
          var gotList = function(err,data) {
            if (err) return callback(err,data);
            
            if (!data.length) return callback("no TEDx event");
            
            if (TEDXID) {
              app.setTEDxMode(data[0].meta);
            }
            
            callback(null,_.map(data,function(talk) {
              
              talk.children = function(q,cb) {
                // youtubeAPI.getPlaylistVideos(talk.meta.youtube,function(err,videos) {
                //                                                   cb(err,_.sortBy(
                //                                                     _.map(videos,TEDxAPI.formatTalkDataFromYoutube),
                //                                                     function (t){ return t.weight||99}
                //                                                     )
                //                                                   );
                //                                                   
                //                                                 });
                var ds = Joshfire.getDataSource('youtube90');
                console.warn('data source ?', ds)
                if (!ds || !ds.find){
                  return ['bullshit'];
                }
                ds.find(
                    {playlist:'EB4E907286FE3EC2', list:'0548DCF75693BB71'},
                    function (err, data){
                      return data;
                      
                    });
                    
                    //playlist : 2011, list:2010
                
                
                  
                
              }
              return talk;
              
            }),{"cache":3600});
            
          };

          // Static TEDx list provided in config.js
          if (TEDXLIST) {
            gotList(null,TEDXLIST);
          } else {
            TEDxAPI.getTEDxList(TEDXID?{"filter":{"id":TEDXID}}:{},gotList);
          }

          
          
          
        }
      }
    ];
    
  }
}
  
  );
}
)(Joshfire.loadModule('joshfire/class'),Joshfire.loadModule('joshfire/tree.data'),Joshfire.loadModule('joshfire/vendor/underscore'),Joshfire.loadModule('src/api/ted'),Joshfire.loadModule('src/api/tedx'),Joshfire.loadModule('src/api/youtube'),Joshfire.loadModule('src/api/twitter'),Joshfire.loadModule('joshfire/adapters/ios/utils/datasource'));
 };

Joshfire.definedModules['joshfire/uielements/list'] = function() { return (
function(UIElement, Class, _) {
  /**
  * @class List base class
  * @name uielements_list
  * @augments uielement
  */
  return Class(UIElement,
      /**
      * @lends uielements_list.prototype
      */
      {
        type: 'List',
        data: [],

        /**
        * Default options:<br /><ul>
        *   <li>defaultSelection {Array}: [&nbsp;]</li>
        *   <li>itemInnerTemplate {String}: &lt;=item.label%&gt;</li>
        *   <li>loadingTemplate {String}: 'Loading...'</li>
        * </ul>
        * @function
        * @return {Object} hash of options.
        */
        getDefaultOptions: function() {
          return _.extend(this.__super(), {
            'persistSelection': true,
            'defaultSelection': [],
            'multiple': false,
            'itemTemplate': '<%= itemInner %>',
            'itemInnerTemplate': '<%= item.label %>',
            'loadingTemplate': 'Loading...'
          });
        },

        /**
        * Init data and set default selection
        * @function
        */
        init: function() {
          this.setData(this.options.data || []);

          //Don't send a select event at startup
          this.setState('selection', this.options.defaultSelection);
        },
       

        /**
        * Sets the tree root associated with the element
        * @function
        * @param {String} dataPath Tree path.
        */
        setDataPath: function(dataPath) {

          //Make sure we bind to a directory
          if (!dataPath.match(/\/$/)) {
            dataPath = dataPath + '/';
          }

          this.__super(dataPath);
        },

        /**
        * Reset selection (with an id)
        * @function
        */
        resetSelection: function() {
          this.selectById(this.options.defaultSelection);
        },

        /**
        * Select item(s) using its/theirs index(es)
        * @function
        * @param {array} indexes
        */
        selectByIndex: function(indexes) {
          //console.warn('select by index', indexes)
          if (!_.isArray(indexes)) {
            indexes = [indexes];
          }
          var ids = [];
          for (var i = 0, l = indexes.length; i < l; i++) {
            ids[i] = this.data[indexes[i]].id;
          }
          this.selectById(ids);
        },

        /**
        * Select a item using its id. Called by selectByIndex
        * @function
        * @param {array} ids
        */
        selectById: function(ids) {
          //console.warn('selct by id', ids)
          var self = this;

          if (!_.isArray(ids)) {
            ids = [ids];
          }

          if (_.isEqual(this.selection, ids)) return;

          this.setState('selection', ids);
          this.publish('select', [ids]);
          this.app.data.publish('select', [_.map(ids, function(id) {
            return self.dataPath + id;
          })]);
        },
        /**
        * The name tells it all
        * @function
        * @param {int} id
        * return {Object}.
        */
        getDataById: function(id) {
          for (var i = 0, l = this.data.length; i < l; i++) {
            if (this.data[i].id == id) {
              return this.data[i];
            }
          }
          return null;
        }
      }
  );
}
)(Joshfire.loadModule('joshfire/adapters/ios/uielement'),Joshfire.loadModule('joshfire/class'),Joshfire.loadModule('joshfire/vendor/underscore'));
 };

Joshfire.definedModules['joshfire/utils/grid'] = function() { return (
function(Class, _) {


  return Class(
      /**
      * @lends utils_grid.prototype
      */
      {

        //Indexed by orientation
        moves: {
          'up': {
            'down': [0, 1],
            'up': [0, -1],
            'right': [1, 0],
            'left': [-1, 0]
          },
          'down': {
            'down': [0, -1],
            'up': [0, 1],
            'right': [1, 0],
            'left': [-1, 0]
          },
          'right': {
            'down': [1, 0],
            'up': [-1, 0],
            'left': [0, 1],
            'right': [0, -1]
          },
          'left': {
            'down': [1, 0],
            'up': [-1, 0],
            'left': [0, -1],
            'right': [0, 1]
          }
        },


        /**
        * @constructs
        * @class A 2D Grid for navigation
        * @param {Object} options Options hash.
        */
        __constructor: function(options) {
          this.options = options;
          this.options.dimensions = options.dimensions || 2;
          this.options.orientation = options.orientation || 'down';
          this.options.direction = options.direction || 'ltr'; //document.dir ?
          this.currentCoords = this.options.defaultPosition || false;
          this.lastCoords = this.options.defaultPosition || false;
          this.id2coords = {};

          if (options.grid) {
            this.setGrid(options.grid);
          }


          if (this.options.inputSource) {
            this.subscribeToInputEvents(this.options.inputSource);
          }
        },

        /**
        * @function
        * @param Object (var).
        */
        setGrid: function(grid) {
          this.grid = grid;
          this.id2coords = {};
          for (var x = 0; x < this.grid.length; x++) {
            for (var y = 0; y < this.grid[x].length; y++) {
              if (this.grid[x][y]) {
                this.id2coords[this.grid[x][y].id] = [y, x];
              }
            }
          }

          if (this.options.onGrid) this.options.onGrid(this.grid);
        },

        getCoordinatesById: function(id) {
          return this.id2coords[id];
        },

        /**
        * @function
        * @param Object (int).
        */
        get: function(coords) {
          return this.grid[coords[1]][coords[0]];
        },

        /**
        * @function
        * @param Object (int).
        */
        goTo: function(coords) {
          if (!this.currentCoords || coords[0] !== this.currentCoords[0] || coords[1] !== this.currentCoords[1]) {
            this.currentCoords = coords;
            this.lastCoords = coords;
            if (this.options.onChange && this.get(this.currentCoords)) this.options.onChange(this.currentCoords, this.get(this.currentCoords));
          }
          if (this.options.onMove) this.options.onMove(this.currentCoords, this.get(this.currentCoords));
        },

        /**
        * @function
        * @param {int}
        */
        goToId: function(id) {
          if (this.id2coords[id]) {
            this.goTo(this.id2coords[id]);
            return true;
          }
          return false;
        },

        /**
        * @function
        * @param {Object}
        */
        go: function(move) {
          if (move == 'default') {
            return this.goTo(this.options.defaultPosition);
          } else if (move == 'last') { //just to re-publish event
            return this.goTo(this.lastCoords);
          }

          var newx = this.moves[this.options.orientation][move][0] + this.currentCoords[0];
          var newy = this.moves[this.options.orientation][move][1] + this.currentCoords[1];
          if ((newy < 0 || newy >= this.grid.length || !this.grid[newy]) || (newx < 0 || newx >= this.grid[newy].length || !this.grid[newy][newx])) {


            // Sticky grid : try to find an item, even if it's not strictly in the same column/line
            if (this.options.sticky) {

              // if x didn't change
              if (this.grid[newy] && this.moves[this.options.orientation][move][0] == 0) {
                //try to find in the same y line
                var closestx = false;

                for (var i = 0; i < this.grid[newy].length; i++) {
                  if (this.grid[newy][i] && (closestx === false || Math.abs(newx - i) < Math.abs(newx - closestx))) {
                    closestx = i;
                  }
                }
                if (closestx !== false) {
                  this.goTo([closestx, newy]);
                  return;
                }
              }

              // if y didn't change
              if (this.moves[this.options.orientation][move][1] == 0) {
                //try to find in the same x line
                var closesty = false;

                for (var j = 0; j < this.grid.length; j++) {
                  if (this.grid[j] && this.grid[j][newx] && (closesty === false || Math.abs(newy - j) < Math.abs(newy - closesty))) {
                    closesty = j;
                  }
                }
                if (closesty !== false) {
                  this.goTo([newx, closesty]);
                  return;
                }
              }

            }

            //absMove is the move that would have been made in the reference "down" orientation
            var oriMove = this.moves[this.options.orientation][move].join('-');
            var absMove = false;
            _.each(this.moves.down, function(elt, k) {
              if (elt.join('-') == oriMove) {
                absMove = k;
              }
            });

            if (this.options.onExit) this.options.onExit(move, absMove); //[ - this.moves[this.options.orientation][move][0], -this.moves[this.options.orientation][move][1]]);
          } else {
            this.goTo([newx, newy]);
          }
        },

        /**
        * @function
        * @param {Object} var
        */
        handleInput: function(data) {
          var cmd = data[0];

          if (this.options.direction == 'rtl' && (this.options.orientation == 'up' || this.options.orientation == 'down')) {
            if (cmd == 'left') {
              cmd = 'right';
            } else if (cmd == 'right') {
              cmd = 'left';
            }
          }
          if (cmd == 'left' || cmd == 'right' || cmd == 'down' || cmd == 'up') {
            this.go(cmd);
          } else if (cmd == 'hover') {
            this.goToId(data[1]);
          } else if (cmd == 'enter') {
            this.goToId(data[1]);
            if (this.options.onValidate) this.options.onValidate(this.currentCoords, this.get(this.currentCoords));
          }

        },

        /**
        * @function
        * @param {Object} obj
        */
        subscribeToInputEvents: function(obj) {
          var self = this;
          obj.subscribe('input', function(ev, data) {
            self.handleInput(data);
          });

        }

      });



}
)(Joshfire.loadModule('joshfire/class'),Joshfire.loadModule('joshfire/vendor/underscore'));
 };

Joshfire.definedModules['joshfire/vendor/iscroll'] = function() { return (
function() {
  
  /*!
   * iScroll v4.1.8 ~ Copyright (c) 2011 Matteo Spinelli, http://cubiq.org
   * Released under MIT license, http://cubiq.org/license
   */

  (function(){
  var m = Math,
  	vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' :
  		(/firefox/i).test(navigator.userAgent) ? 'Moz' :
  		'opera' in window ? 'O' : '',

  	// Browser capabilities
  	has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),
  	hasTouch = 'ontouchstart' in window,
  	hasTransform = vendor + 'Transform' in document.documentElement.style,
  	isAndroid = (/android/gi).test(navigator.appVersion),
  	isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
  	isPlaybook = (/playbook/gi).test(navigator.appVersion),
  	hasTransitionEnd = isIDevice || isPlaybook,
  	nextFrame = (function() {
  	    return window.requestAnimationFrame
  			|| window.webkitRequestAnimationFrame
  			|| window.mozRequestAnimationFrame
  			|| window.oRequestAnimationFrame
  			|| window.msRequestAnimationFrame
  			|| function(callback) { return setTimeout(callback, 1); }
  	})(),
  	cancelFrame = (function () {
  	    return window.cancelRequestAnimationFrame
  			|| window.webkitCancelRequestAnimationFrame
  			|| window.mozCancelRequestAnimationFrame
  			|| window.oCancelRequestAnimationFrame
  			|| window.msCancelRequestAnimationFrame
  			|| clearTimeout
  	})(),

  	// Events
  	RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
  	START_EV = hasTouch ? 'touchstart' : 'mousedown',
  	MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
  	END_EV = hasTouch ? 'touchend' : 'mouseup',
  	CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
  	WHEEL_EV = vendor == 'Moz' ? 'DOMMouseScroll' : 'mousewheel',

  	// Helpers
  	trnOpen = 'translate' + (has3d ? '3d(' : '('),
  	trnClose = has3d ? ',0)' : ')',

  	// Constructor
  	iScroll = function (el, options) {
  		var that = this,
  			doc = document,
  			i;

  		that.wrapper = typeof el == 'object' ? el : doc.getElementById(el);
  		that.wrapper.style.overflow = 'hidden';
  		that.scroller = that.wrapper.children[0];

  		// Default options
  		that.options = {
  			hScroll: true,
  			vScroll: true,
  			bounce: true,
  			bounceLock: false,
  			momentum: true,
  			lockDirection: true,
  			useTransform: true,
  			useTransition: false,
  			topOffset: 0,
  			checkDOMChanges: false,		// Experimental

  			// Scrollbar
  			hScrollbar: true,
  			vScrollbar: true,
  			fixedScrollbar: isAndroid,
  			hideScrollbar: isIDevice,
  			fadeScrollbar: isIDevice && has3d,
  			scrollbarClass: '',

  			// Zoom
  			zoom: false,
  			zoomMin: 1,
  			zoomMax: 4,
  			doubleTapZoom: 2,
  			wheelAction: 'scroll',

  			// Snap
  			snap: false,
  			snapThreshold: 1,

  			// Events
  			onRefresh: null,
  			onBeforeScrollStart: function (e) { e.preventDefault(); },
  			onScrollStart: null,
  			onBeforeScrollMove: null,
  			onScrollMove: null,
  			onBeforeScrollEnd: null,
  			onScrollEnd: null,
  			onTouchEnd: null,
  			onDestroy: null,
  			onZoomStart: null,
  			onZoom: null,
  			onZoomEnd: null
  		};

  		// User defined options
  		for (i in options) that.options[i] = options[i];

  		// Normalize options
  		that.options.useTransform = hasTransform ? that.options.useTransform : false;
  		that.options.hScrollbar = that.options.hScroll && that.options.hScrollbar;
  		that.options.vScrollbar = that.options.vScroll && that.options.vScrollbar;
  		that.options.zoom = that.options.useTransform && that.options.zoom;
  		that.options.useTransition = hasTransitionEnd && that.options.useTransition;

  		// Set some default styles
  		that.scroller.style[vendor + 'TransitionProperty'] = that.options.useTransform ? '-' + vendor.toLowerCase() + '-transform' : 'top left';
  		that.scroller.style[vendor + 'TransitionDuration'] = '0';
  		that.scroller.style[vendor + 'TransformOrigin'] = '0 0';
  		if (that.options.useTransition) that.scroller.style[vendor + 'TransitionTimingFunction'] = 'cubic-bezier(0.33,0.66,0.66,1)';

  		if (that.options.useTransform) that.scroller.style[vendor + 'Transform'] = trnOpen + '0,0' + trnClose;
  		else that.scroller.style.cssText += ';position:absolute;top:0;left:0';

  		if (that.options.useTransition) that.options.fixedScrollbar = true;

  		that.refresh();

  		that._bind(RESIZE_EV, window);
  		that._bind(START_EV);
  		if (!hasTouch) {
  			that._bind('mouseout', that.wrapper);
  			that._bind(WHEEL_EV);
  		}

  		if (that.options.checkDOMChanges) that.checkDOMTime = setInterval(function () {
  			that._checkDOMChanges();
  		}, 500);
  	};

  // Prototype
  iScroll.prototype = {
  	enabled: true,
  	x: 0,
  	y: 0,
  	steps: [],
  	scale: 1,
  	currPageX: 0, currPageY: 0,
  	pagesX: [], pagesY: [],
  	aniTime: null,
  	wheelZoomCount: 0,

  	handleEvent: function (e) {
  		var that = this;
  		switch(e.type) {
  			case START_EV:
  				if (!hasTouch && e.button !== 0) return;
  				that._start(e);
  				break;
  			case MOVE_EV: that._move(e); break;
  			case END_EV:
  			case CANCEL_EV: that._end(e); break;
  			case RESIZE_EV: that._resize(); break;
  			case WHEEL_EV: that._wheel(e); break;
  			case 'mouseout': that._mouseout(e); break;
  			case 'webkitTransitionEnd': that._transitionEnd(e); break;
  		}
  	},

  	_checkDOMChanges: function () {
  		if (this.moved || this.zoomed || this.animating ||
  			(this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale)) return;

  		this.refresh();
  	},

  	_scrollbar: function (dir) {
  		var that = this,
  			doc = document,
  			bar;

  		if (!that[dir + 'Scrollbar']) {
  			if (that[dir + 'ScrollbarWrapper']) {
  				if (hasTransform) that[dir + 'ScrollbarIndicator'].style[vendor + 'Transform'] = '';
  				that[dir + 'ScrollbarWrapper'].parentNode.removeChild(that[dir + 'ScrollbarWrapper']);
  				that[dir + 'ScrollbarWrapper'] = null;
  				that[dir + 'ScrollbarIndicator'] = null;
  			}

  			return;
  		}

  		if (!that[dir + 'ScrollbarWrapper']) {
  			// Create the scrollbar wrapper
  			bar = doc.createElement('div');

  			if (that.options.scrollbarClass) bar.className = that.options.scrollbarClass + dir.toUpperCase();
  			else bar.style.cssText = 'position:absolute;z-index:100;' + (dir == 'h' ? 'height:7px;bottom:1px;left:2px;right:' + (that.vScrollbar ? '7' : '2') + 'px' : 'width:7px;bottom:' + (that.hScrollbar ? '7' : '2') + 'px;top:2px;right:1px');

  			bar.style.cssText += ';pointer-events:none;-' + vendor + '-transition-property:opacity;-' + vendor + '-transition-duration:' + (that.options.fadeScrollbar ? '350ms' : '0') + ';overflow:hidden;opacity:' + (that.options.hideScrollbar ? '0' : '1');

  			that.wrapper.appendChild(bar);
  			that[dir + 'ScrollbarWrapper'] = bar;

  			// Create the scrollbar indicator
  			bar = doc.createElement('div');
  			if (!that.options.scrollbarClass) {
  				bar.style.cssText = 'position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);-' + vendor + '-background-clip:padding-box;-' + vendor + '-box-sizing:border-box;' + (dir == 'h' ? 'height:100%' : 'width:100%') + ';-' + vendor + '-border-radius:3px;border-radius:3px';
  			}
  			bar.style.cssText += ';pointer-events:none;-' + vendor + '-transition-property:-' + vendor + '-transform;-' + vendor + '-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);-' + vendor + '-transition-duration:0;-' + vendor + '-transform:' + trnOpen + '0,0' + trnClose;
  			if (that.options.useTransition) bar.style.cssText += ';-' + vendor + '-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)';

  			that[dir + 'ScrollbarWrapper'].appendChild(bar);
  			that[dir + 'ScrollbarIndicator'] = bar;
  		}

  		if (dir == 'h') {
  			that.hScrollbarSize = that.hScrollbarWrapper.clientWidth;
  			that.hScrollbarIndicatorSize = m.max(m.round(that.hScrollbarSize * that.hScrollbarSize / that.scrollerW), 8);
  			that.hScrollbarIndicator.style.width = that.hScrollbarIndicatorSize + 'px';
  			that.hScrollbarMaxScroll = that.hScrollbarSize - that.hScrollbarIndicatorSize;
  			that.hScrollbarProp = that.hScrollbarMaxScroll / that.maxScrollX;
  		} else {
  			that.vScrollbarSize = that.vScrollbarWrapper.clientHeight;
  			that.vScrollbarIndicatorSize = m.max(m.round(that.vScrollbarSize * that.vScrollbarSize / that.scrollerH), 8);
  			that.vScrollbarIndicator.style.height = that.vScrollbarIndicatorSize + 'px';
  			that.vScrollbarMaxScroll = that.vScrollbarSize - that.vScrollbarIndicatorSize;
  			that.vScrollbarProp = that.vScrollbarMaxScroll / that.maxScrollY;
  		}

  		// Reset position
  		that._scrollbarPos(dir, true);
  	},

  	_resize: function () {
  		var that = this;
  		setTimeout(function () { that.refresh(); }, isAndroid ? 200 : 0);
  	},

  	_pos: function (x, y) {
  		x = this.hScroll ? x : 0;
  		y = this.vScroll ? y : 0;

  		if (this.options.useTransform) {
  			this.scroller.style[vendor + 'Transform'] = trnOpen + x + 'px,' + y + 'px' + trnClose + ' scale(' + this.scale + ')';
  		} else {
  			x = m.round(x);
  			y = m.round(y);
  			this.scroller.style.left = x + 'px';
  			this.scroller.style.top = y + 'px';
  		}

  		this.x = x;
  		this.y = y;

  		this._scrollbarPos('h');
  		this._scrollbarPos('v');
  	},

  	_scrollbarPos: function (dir, hidden) {
  		var that = this,
  			pos = dir == 'h' ? that.x : that.y,
  			size;

  		if (!that[dir + 'Scrollbar']) return;

  		pos = that[dir + 'ScrollbarProp'] * pos;

  		if (pos < 0) {
  			if (!that.options.fixedScrollbar) {
  				size = that[dir + 'ScrollbarIndicatorSize'] + m.round(pos * 3);
  				if (size < 8) size = 8;
  				that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
  			}
  			pos = 0;
  		} else if (pos > that[dir + 'ScrollbarMaxScroll']) {
  			if (!that.options.fixedScrollbar) {
  				size = that[dir + 'ScrollbarIndicatorSize'] - m.round((pos - that[dir + 'ScrollbarMaxScroll']) * 3);
  				if (size < 8) size = 8;
  				that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
  				pos = that[dir + 'ScrollbarMaxScroll'] + (that[dir + 'ScrollbarIndicatorSize'] - size);
  			} else {
  				pos = that[dir + 'ScrollbarMaxScroll'];
  			}
  		}

  		that[dir + 'ScrollbarWrapper'].style[vendor + 'TransitionDelay'] = '0';
  		that[dir + 'ScrollbarWrapper'].style.opacity = hidden && that.options.hideScrollbar ? '0' : '1';
  		that[dir + 'ScrollbarIndicator'].style[vendor + 'Transform'] = trnOpen + (dir == 'h' ? pos + 'px,0' : '0,' + pos + 'px') + trnClose;
  	},

  	_start: function (e) {
  		var that = this,
  			point = hasTouch ? e.touches[0] : e,
  			matrix, x, y,
  			c1, c2;

  		if (!that.enabled) return;

  		if (that.options.onBeforeScrollStart) that.options.onBeforeScrollStart.call(that, e);

  		if (that.options.useTransition || that.options.zoom) that._transitionTime(0);

  		that.moved = false;
  		that.animating = false;
  		that.zoomed = false;
  		that.distX = 0;
  		that.distY = 0;
  		that.absDistX = 0;
  		that.absDistY = 0;
  		that.dirX = 0;
  		that.dirY = 0;

  		// Gesture start
  		if (that.options.zoom && hasTouch && e.touches.length > 1) {
  			c1 = m.abs(e.touches[0].pageX-e.touches[1].pageX);
  			c2 = m.abs(e.touches[0].pageY-e.touches[1].pageY);
  			that.touchesDistStart = m.sqrt(c1 * c1 + c2 * c2);

  			that.originX = m.abs(e.touches[0].pageX + e.touches[1].pageX - that.wrapperOffsetLeft * 2) / 2 - that.x;
  			that.originY = m.abs(e.touches[0].pageY + e.touches[1].pageY - that.wrapperOffsetTop * 2) / 2 - that.y;

  			if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
  		}

  		if (that.options.momentum) {
  			if (that.options.useTransform) {
  				// Very lame general purpose alternative to CSSMatrix
  				matrix = getComputedStyle(that.scroller, null)[vendor + 'Transform'].replace(/[^0-9-.,]/g, '').split(',');
  				x = matrix[4] * 1;
  				y = matrix[5] * 1;
  			} else {
  				x = getComputedStyle(that.scroller, null).left.replace(/[^0-9-]/g, '') * 1;
  				y = getComputedStyle(that.scroller, null).top.replace(/[^0-9-]/g, '') * 1;
  			}

  			if (x != that.x || y != that.y) {
  				if (that.options.useTransition) that._unbind('webkitTransitionEnd');
  				else cancelFrame(that.aniTime);
  				that.steps = [];
  				that._pos(x, y);
  			}
  		}

  		that.absStartX = that.x;	// Needed by snap threshold
  		that.absStartY = that.y;

  		that.startX = that.x;
  		that.startY = that.y;
  		that.pointX = point.pageX;
  		that.pointY = point.pageY;

  		that.startTime = e.timeStamp || (new Date()).getTime();

  		if (that.options.onScrollStart) that.options.onScrollStart.call(that, e);

  		that._bind(MOVE_EV);
  		that._bind(END_EV);
  		that._bind(CANCEL_EV);
  	},

  	_move: function (e) {
  		var that = this,
  			point = hasTouch ? e.touches[0] : e,
  			deltaX = point.pageX - that.pointX,
  			deltaY = point.pageY - that.pointY,
  			newX = that.x + deltaX,
  			newY = that.y + deltaY,
  			c1, c2, scale,
  			timestamp = e.timeStamp || (new Date()).getTime();

  		if (that.options.onBeforeScrollMove) that.options.onBeforeScrollMove.call(that, e);

  		// Zoom
  		if (that.options.zoom && hasTouch && e.touches.length > 1) {
  			c1 = m.abs(e.touches[0].pageX - e.touches[1].pageX);
  			c2 = m.abs(e.touches[0].pageY - e.touches[1].pageY);
  			that.touchesDist = m.sqrt(c1*c1+c2*c2);

  			that.zoomed = true;

  			scale = 1 / that.touchesDistStart * that.touchesDist * this.scale;

  			if (scale < that.options.zoomMin) scale = 0.5 * that.options.zoomMin * Math.pow(2.0, scale / that.options.zoomMin);
  			else if (scale > that.options.zoomMax) scale = 2.0 * that.options.zoomMax * Math.pow(0.5, that.options.zoomMax / scale);

  			that.lastScale = scale / this.scale;

  			newX = this.originX - this.originX * that.lastScale + this.x,
  			newY = this.originY - this.originY * that.lastScale + this.y;

  			this.scroller.style[vendor + 'Transform'] = trnOpen + newX + 'px,' + newY + 'px' + trnClose + ' scale(' + scale + ')';

  			if (that.options.onZoom) that.options.onZoom.call(that, e);
  			return;
  		}

  		that.pointX = point.pageX;
  		that.pointY = point.pageY;

  		// Slow down if outside of the boundaries
  		if (newX > 0 || newX < that.maxScrollX) {
  			newX = that.options.bounce ? that.x + (deltaX / 2) : newX >= 0 || that.maxScrollX >= 0 ? 0 : that.maxScrollX;
  		}
  		if (newY > that.minScrollY || newY < that.maxScrollY) { 
  			newY = that.options.bounce ? that.y + (deltaY / 2) : newY >= that.minScrollY || that.maxScrollY >= 0 ? that.minScrollY : that.maxScrollY;
  		}

  		if (that.absDistX < 6 && that.absDistY < 6) {
  			that.distX += deltaX;
  			that.distY += deltaY;
  			that.absDistX = m.abs(that.distX);
  			that.absDistY = m.abs(that.distY);

  			return;
  		}

  		// Lock direction
  		if (that.options.lockDirection) {
  			if (that.absDistX > that.absDistY + 5) {
  				newY = that.y;
  				deltaY = 0;
  			} else if (that.absDistY > that.absDistX + 5) {
  				newX = that.x;
  				deltaX = 0;
  			}
  		}

  		that.moved = true;
  		that._pos(newX, newY);
  		that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
  		that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

  		if (timestamp - that.startTime > 300) {
  			that.startTime = timestamp;
  			that.startX = that.x;
  			that.startY = that.y;
  		}

  		if (that.options.onScrollMove) that.options.onScrollMove.call(that, e);
  	},

  	_end: function (e) {
  		if (hasTouch && e.touches.length != 0) return;

  		var that = this,
  			point = hasTouch ? e.changedTouches[0] : e,
  			target, ev,
  			momentumX = { dist:0, time:0 },
  			momentumY = { dist:0, time:0 },
  			duration = (e.timeStamp || (new Date()).getTime()) - that.startTime,
  			newPosX = that.x,
  			newPosY = that.y,
  			distX, distY,
  			newDuration,
  			scale;

  		that._unbind(MOVE_EV);
  		that._unbind(END_EV);
  		that._unbind(CANCEL_EV);

  		if (that.options.onBeforeScrollEnd) that.options.onBeforeScrollEnd.call(that, e);

  		if (that.zoomed) {
  			scale = that.scale * that.lastScale;
  			scale = Math.max(that.options.zoomMin, scale);
  			scale = Math.min(that.options.zoomMax, scale);
  			that.lastScale = scale / that.scale;
  			that.scale = scale;

  			that.x = that.originX - that.originX * that.lastScale + that.x;
  			that.y = that.originY - that.originY * that.lastScale + that.y;

  			that.scroller.style[vendor + 'TransitionDuration'] = '200ms';
  			that.scroller.style[vendor + 'Transform'] = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose + ' scale(' + that.scale + ')';

  			that.zoomed = false;
  			that.refresh();

  			if (that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
  			return;
  		}

  		if (!that.moved) {
  		  
  			if (hasTouch) {
  				if (that.doubleTapTimer && that.options.zoom) {
  					// Double tapped
  					clearTimeout(that.doubleTapTimer);
  					that.doubleTapTimer = null;
  					if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
  					that.zoom(that.pointX, that.pointY, that.scale == 1 ? that.options.doubleTapZoom : 1);
  					if (that.options.onZoomEnd) {
  						setTimeout(function() {
  							that.options.onZoomEnd.call(that, e);
  						}, 200); // 200 is default zoom duration
  					}
  				} else {
  					that.doubleTapTimer = setTimeout(function () {
  						that.doubleTapTimer = null;

  						// Find the last touched element
  						target = point.target;
  						while (target.nodeType != 1) target = target.parentNode;

  						if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
  							ev = document.createEvent('MouseEvents');
  							ev.initMouseEvent('click', true, true, e.view, 1,
  								point.screenX, point.screenY, point.clientX, point.clientY,
  								e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
  								0, null);
  							ev._fake = true;
  							target.dispatchEvent(ev);
  						}
  					}, that.options.zoom ? 250 : 0);
  				}
  			}

  			that._resetPos(200);

  			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
  			return;
  		}

  		if (duration < 300 && that.options.momentum) {
  			momentumX = newPosX ? that._momentum(newPosX - that.startX, duration, -that.x, that.scrollerW - that.wrapperW + that.x, that.options.bounce ? that.wrapperW : 0) : momentumX;
  			momentumY = newPosY ? that._momentum(newPosY - that.startY, duration, -that.y, (that.maxScrollY < 0 ? that.scrollerH - that.wrapperH + that.y - that.minScrollY : 0), that.options.bounce ? that.wrapperH : 0) : momentumY;

  			newPosX = that.x + momentumX.dist;
  			newPosY = that.y + momentumY.dist;

   			if ((that.x > 0 && newPosX > 0) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)) momentumX = { dist:0, time:0 };
   			if ((that.y > that.minScrollY && newPosY > that.minScrollY) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) momentumY = { dist:0, time:0 };
  		}

  		if (momentumX.dist || momentumY.dist) {
  			newDuration = m.max(m.max(momentumX.time, momentumY.time), 10);

  			// Do we need to snap?
  			if (that.options.snap) {
  				distX = newPosX - that.absStartX;
  				distY = newPosY - that.absStartY;
  				if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) { that.scrollTo(that.absStartX, that.absStartY, 200); }
  				else {
  					snap = that._snap(newPosX, newPosY);
  					newPosX = snap.x;
  					newPosY = snap.y;
  					newDuration = m.max(snap.time, newDuration);
  				}
  			}

  			that.scrollTo(newPosX, newPosY, newDuration);

  			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
  			return;
  		}

  		// Do we need to snap?
  		if (that.options.snap) {
  			distX = newPosX - that.absStartX;
  			distY = newPosY - that.absStartY;
  			if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) that.scrollTo(that.absStartX, that.absStartY, 200);
  			else {
  				snap = that._snap(that.x, that.y);
  				if (snap.x != that.x || snap.y != that.y) that.scrollTo(snap.x, snap.y, snap.time);
  			}

  			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
  			return;
  		}

  		that._resetPos(200);
  		if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
  	},

  	_resetPos: function (time) {
  		var that = this,
  			resetX = that.x >= 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x,
  			resetY = that.y >= that.minScrollY || that.maxScrollY > 0 ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

  		if (resetX == that.x && resetY == that.y) {
  			if (that.moved) {
  				that.moved = false;
  				if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);		// Execute custom code on scroll end
  			}

  			if (that.hScrollbar && that.options.hideScrollbar) {
  				if (vendor == 'webkit') that.hScrollbarWrapper.style[vendor + 'TransitionDelay'] = '300ms';
  				that.hScrollbarWrapper.style.opacity = '0';
  			}
  			if (that.vScrollbar && that.options.hideScrollbar) {
  				if (vendor == 'webkit') that.vScrollbarWrapper.style[vendor + 'TransitionDelay'] = '300ms';
  				that.vScrollbarWrapper.style.opacity = '0';
  			}

  			return;
  		}

  		that.scrollTo(resetX, resetY, time || 0);
  	},

  	_wheel: function (e) {
  		var that = this,
  			wheelDeltaX, wheelDeltaY,
  			deltaX, deltaY,
  			deltaScale;

  		if ('wheelDeltaX' in e) {
  			wheelDeltaX = e.wheelDeltaX / 12;
  			wheelDeltaY = e.wheelDeltaY / 12;
  		} else if ('detail' in e) {
  			wheelDeltaX = wheelDeltaY = -e.detail * 3;
  		} else {
  			wheelDeltaX = wheelDeltaY = -e.wheelDelta;
  		}

  		if (that.options.wheelAction == 'zoom') {
  			deltaScale = that.scale * Math.pow(2, 1/3 * (wheelDeltaY ? wheelDeltaY / Math.abs(wheelDeltaY) : 0));
  			if (deltaScale < that.options.zoomMin) deltaScale = that.options.zoomMin;
  			if (deltaScale > that.options.zoomMax) deltaScale = that.options.zoomMax;

  			if (deltaScale != that.scale) {
  				if (!that.wheelZoomCount && that.options.onZoomStart) that.options.onZoomStart.call(that, e);
  				that.wheelZoomCount++;

  				that.zoom(e.pageX, e.pageY, deltaScale, 400);

  				setTimeout(function() {
  					that.wheelZoomCount--;
  					if (!that.wheelZoomCount && that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
  				}, 400);
  			}

  			return;
  		}

  		deltaX = that.x + wheelDeltaX;
  		deltaY = that.y + wheelDeltaY;

  		if (deltaX > 0) deltaX = 0;
  		else if (deltaX < that.maxScrollX) deltaX = that.maxScrollX;

  		if (deltaY > that.minScrollY) deltaY = that.minScrollY;
  		else if (deltaY < that.maxScrollY) deltaY = that.maxScrollY;

  		that.scrollTo(deltaX, deltaY, 0);
  	},

  	_mouseout: function (e) {
  		var t = e.relatedTarget;

  		if (!t) {
  			this._end(e);
  			return;
  		}

  		while (t = t.parentNode) if (t == this.wrapper) return;

  		this._end(e);
  	},

  	_transitionEnd: function (e) {
  		var that = this;

  		if (e.target != that.scroller) return;

  		that._unbind('webkitTransitionEnd');

  		that._startAni();
  	},


  	/**
  	 *
  	 * Utilities
  	 *
  	 */
  	_startAni: function () {
  		var that = this,
  			startX = that.x, startY = that.y,
  			startTime = (new Date).getTime(),
  			step, easeOut;

  		if (that.animating) return;

  		if (!that.steps.length) {
  			that._resetPos(400);
  			return;
  		}

  		step = that.steps.shift();

  		if (step.x == startX && step.y == startY) step.time = 0;

  		that.animating = true;
  		that.moved = true;

  		if (that.options.useTransition) {
  			that._transitionTime(step.time);
  			that._pos(step.x, step.y);
  			that.animating = false;
  			if (step.time) that._bind('webkitTransitionEnd');
  			else that._resetPos(0);
  			return;
  		}

  		(function animate () {
  			var now = (new Date).getTime(),
  				newX, newY;

  			if (now >= startTime + step.time) {
  				that._pos(step.x, step.y);
  				that.animating = false;
  				if (that.options.onAnimationEnd) that.options.onAnimationEnd.call(that);			// Execute custom code on animation end
  				that._startAni();
  				return;
  			}

  			now = (now - startTime) / step.time - 1;
  			easeOut = m.sqrt(1 - now * now);
  			newX = (step.x - startX) * easeOut + startX;
  			newY = (step.y - startY) * easeOut + startY;
  			that._pos(newX, newY);
  			if (that.animating) that.aniTime = nextFrame(animate);
  		})();
  	},

  	_transitionTime: function (time) {
  		time += 'ms';
  		this.scroller.style[vendor + 'TransitionDuration'] = time;
  		if (this.hScrollbar) this.hScrollbarIndicator.style[vendor + 'TransitionDuration'] = time;
  		if (this.vScrollbar) this.vScrollbarIndicator.style[vendor + 'TransitionDuration'] = time;
  	},

  	_momentum: function (dist, time, maxDistUpper, maxDistLower, size) {
  		var deceleration = 0.0006,
  			speed = m.abs(dist) / time,
  			newDist = (speed * speed) / (2 * deceleration),
  			newTime = 0, outsideDist = 0;

  		// Proportinally reduce speed if we are outside of the boundaries 
  		if (dist > 0 && newDist > maxDistUpper) {
  			outsideDist = size / (6 / (newDist / speed * deceleration));
  			maxDistUpper = maxDistUpper + outsideDist;
  			speed = speed * maxDistUpper / newDist;
  			newDist = maxDistUpper;
  		} else if (dist < 0 && newDist > maxDistLower) {
  			outsideDist = size / (6 / (newDist / speed * deceleration));
  			maxDistLower = maxDistLower + outsideDist;
  			speed = speed * maxDistLower / newDist;
  			newDist = maxDistLower;
  		}

  		newDist = newDist * (dist < 0 ? -1 : 1);
  		newTime = speed / deceleration;

  		return { dist: newDist, time: m.round(newTime) };
  	},

  	_offset: function (el) {
  		var left = -el.offsetLeft,
  			top = -el.offsetTop;

  		while (el = el.offsetParent) {
  			left -= el.offsetLeft;
  			top -= el.offsetTop;
  		}

  		if (el != this.wrapper) {
  			left *= this.scale;
  			top *= this.scale;
  		}

  		return { left: left, top: top };
  	},

  	_snap: function (x, y) {
  		var that = this,
  			i, l,
  			page, time,
  			sizeX, sizeY;

  		// Check page X
  		page = that.pagesX.length - 1;
  		for (i=0, l=that.pagesX.length; i<l; i++) {
  			if (x >= that.pagesX[i]) {
  				page = i;
  				break;
  			}
  		}
  		if (page == that.currPageX && page > 0 && that.dirX < 0) page--;
  		x = that.pagesX[page];
  		sizeX = m.abs(x - that.pagesX[that.currPageX]);
  		sizeX = sizeX ? m.abs(that.x - x) / sizeX * 500 : 0;
  		that.currPageX = page;

  		// Check page Y
  		page = that.pagesY.length-1;
  		for (i=0; i<page; i++) {
  			if (y >= that.pagesY[i]) {
  				page = i;
  				break;
  			}
  		}
  		if (page == that.currPageY && page > 0 && that.dirY < 0) page--;
  		y = that.pagesY[page];
  		sizeY = m.abs(y - that.pagesY[that.currPageY]);
  		sizeY = sizeY ? m.abs(that.y - y) / sizeY * 500 : 0;
  		that.currPageY = page;

  		// Snap with constant speed (proportional duration)
  		time = m.round(m.max(sizeX, sizeY)) || 200;

  		return { x: x, y: y, time: time };
  	},

  	_bind: function (type, el, bubble) {
  		(el || this.scroller).addEventListener(type, this, !!bubble);
  	},

  	_unbind: function (type, el, bubble) {
  		(el || this.scroller).removeEventListener(type, this, !!bubble);
  	},


  	/**
  	 *
  	 * Public methods
  	 *
  	 */
  	destroy: function () {
  		var that = this;

  		that.scroller.style[vendor + 'Transform'] = '';

  		// Remove the scrollbars
  		that.hScrollbar = false;
  		that.vScrollbar = false;
  		that._scrollbar('h');
  		that._scrollbar('v');

  		// Remove the event listeners
  		that._unbind(RESIZE_EV, window);
  		that._unbind(START_EV);
  		that._unbind(MOVE_EV);
  		that._unbind(END_EV);
  		that._unbind(CANCEL_EV);

  		if (that.options.hasTouch) {
  			that._unbind('mouseout', that.wrapper);
  			that._unbind(WHEEL_EV);
  		}

  		if (that.options.useTransition) that._unbind('webkitTransitionEnd');

  		if (that.options.checkDOMChanges) clearInterval(that.checkDOMTime);

  		if (that.options.onDestroy) that.options.onDestroy.call(that);
  	},

  	refresh: function () {
  		var that = this,
  			offset,
  			pos = 0,
  			page = 0;

  		if (that.scale < that.options.zoomMin) that.scale = that.options.zoomMin;
  		that.wrapperW = that.wrapper.clientWidth || 1;
  		that.wrapperH = that.wrapper.clientHeight || 1;

  		that.minScrollY = -that.options.topOffset || 0;
  		that.scrollerW = m.round(that.scroller.offsetWidth * that.scale);
  		that.scrollerH = m.round((that.scroller.offsetHeight + that.minScrollY) * that.scale);
  		that.maxScrollX = that.wrapperW - that.scrollerW;
  		that.maxScrollY = that.wrapperH - that.scrollerH + that.minScrollY;
  		that.dirX = 0;
  		that.dirY = 0;

  		if (that.options.onRefresh) that.options.onRefresh.call(that);

  		that.hScroll = that.options.hScroll && that.maxScrollX < 0;
  		that.vScroll = that.options.vScroll && (!that.options.bounceLock && !that.hScroll || that.scrollerH > that.wrapperH);

  		that.hScrollbar = that.hScroll && that.options.hScrollbar;
  		that.vScrollbar = that.vScroll && that.options.vScrollbar && that.scrollerH > that.wrapperH;

  		offset = that._offset(that.wrapper);
  		that.wrapperOffsetLeft = -offset.left;
  		that.wrapperOffsetTop = -offset.top;

  		// Prepare snap
  		if (typeof that.options.snap == 'string') {
  			that.pagesX = [];
  			that.pagesY = [];
  			els = that.scroller.querySelectorAll(that.options.snap);
  			for (i=0, l=els.length; i<l; i++) {
  				pos = that._offset(els[i]);
  				pos.left += that.wrapperOffsetLeft;
  				pos.top += that.wrapperOffsetTop;
  				that.pagesX[i] = pos.left < that.maxScrollX ? that.maxScrollX : pos.left * that.scale;
  				that.pagesY[i] = pos.top < that.maxScrollY ? that.maxScrollY : pos.top * that.scale;
  			}
  		} else if (that.options.snap) {
  			that.pagesX = [];
  			while (pos >= that.maxScrollX) {
  				that.pagesX[page] = pos;
  				pos = pos - that.wrapperW;
  				page++;
  			}
  			if (that.maxScrollX%that.wrapperW) that.pagesX[that.pagesX.length] = that.maxScrollX - that.pagesX[that.pagesX.length-1] + that.pagesX[that.pagesX.length-1];

  			pos = 0;
  			page = 0;
  			that.pagesY = [];
  			while (pos >= that.maxScrollY) {
  				that.pagesY[page] = pos;
  				pos = pos - that.wrapperH;
  				page++;
  			}
  			if (that.maxScrollY%that.wrapperH) that.pagesY[that.pagesY.length] = that.maxScrollY - that.pagesY[that.pagesY.length-1] + that.pagesY[that.pagesY.length-1];
  		}

  		// Prepare the scrollbars
  		that._scrollbar('h');
  		that._scrollbar('v');

  		if (!that.zoomed) {
  			that.scroller.style[vendor + 'TransitionDuration'] = '0';
  			that._resetPos(200);
  		}
  	},

  	scrollTo: function (x, y, time, relative) {
  		var that = this,
  			step = x,
  			i, l;

  		that.stop();

  		if (!step.length) step = [{ x: x, y: y, time: time, relative: relative }];

  		for (i=0, l=step.length; i<l; i++) {
  			if (step[i].relative) { step[i].x = that.x - step[i].x; step[i].y = that.y - step[i].y; }
  			that.steps.push({ x: step[i].x, y: step[i].y, time: step[i].time || 0 });
  		}

  		that._startAni();
  	},

  	scrollToElement: function (el, time) {
  		var that = this, pos;
  		el = el.nodeType ? el : that.scroller.querySelector(el);
  		if (!el) return;

  		pos = that._offset(el);
  		pos.left += that.wrapperOffsetLeft;
  		pos.top += that.wrapperOffsetTop;

  		pos.left = pos.left > 0 ? 0 : pos.left < that.maxScrollX ? that.maxScrollX : pos.left;
  		pos.top = pos.top > that.minScrollY ? that.minScrollY : pos.top < that.maxScrollY ? that.maxScrollY : pos.top;
  		time = time === undefined ? m.max(m.abs(pos.left)*2, m.abs(pos.top)*2) : time;

  		that.scrollTo(pos.left, pos.top, time);
  	},

  	scrollToPage: function (pageX, pageY, time) {
  		var that = this, x, y;

  		if (that.options.snap) {
  			pageX = pageX == 'next' ? that.currPageX+1 : pageX == 'prev' ? that.currPageX-1 : pageX;
  			pageY = pageY == 'next' ? that.currPageY+1 : pageY == 'prev' ? that.currPageY-1 : pageY;

  			pageX = pageX < 0 ? 0 : pageX > that.pagesX.length-1 ? that.pagesX.length-1 : pageX;
  			pageY = pageY < 0 ? 0 : pageY > that.pagesY.length-1 ? that.pagesY.length-1 : pageY;

  			that.currPageX = pageX;
  			that.currPageY = pageY;
  			x = that.pagesX[pageX];
  			y = that.pagesY[pageY];
  		} else {
  			x = -that.wrapperW * pageX;
  			y = -that.wrapperH * pageY;
  			if (x < that.maxScrollX) x = that.maxScrollX;
  			if (y < that.maxScrollY) y = that.maxScrollY;
  		}

  		that.scrollTo(x, y, time || 400);
  	},

  	disable: function () {
  		this.stop();
  		this._resetPos(0);
  		this.enabled = false;

  		// If disabled after touchstart we make sure that there are no left over events
  		this._unbind(MOVE_EV);
  		this._unbind(END_EV);
  		this._unbind(CANCEL_EV);
  	},

  	enable: function () {
  		this.enabled = true;
  	},

  	stop: function () {
  		if (this.options.useTransition) this._unbind('webkitTransitionEnd');
  		else cancelFrame(this.aniTime);
  		this.steps = [];
  		this.moved = false;
  		this.animating = false;
  	},

  	zoom: function (x, y, scale, time) {
  		var that = this,
  			relScale = scale / that.scale;

  		if (!that.options.useTransform) return;

  		that.zoomed = true;
  		time = time === undefined ? 200 : time;
  		x = x - that.wrapperOffsetLeft - that.x;
  		y = y - that.wrapperOffsetTop - that.y;
  		that.x = x - x * relScale + that.x;
  		that.y = y - y * relScale + that.y;

  		that.scale = scale;
  		that.refresh();

  		that.x = that.x > 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x;
  		that.y = that.y > that.minScrollY ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

  		that.scroller.style[vendor + 'TransitionDuration'] = time + 'ms';
  		that.scroller.style[vendor + 'Transform'] = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose + ' scale(' + scale + ')';
  		that.zoomed = false;
  	},

  	isReady: function () {
  		return !this.moved && !this.zoomed && !this.animating;
  	}
  };

  if (typeof exports !== 'undefined') exports.iScroll = iScroll;
  else window.iScroll = iScroll;

  })();
  
  return window.iScroll;
  
}
)();
 };

Joshfire.definedModules['joshfire/adapters/android/uielements/list'] = function() { return (
function(List, Class,Grid, _, iScrollPlugin, $) {
  /**
  * @description Uses iScroll4, iScroll object is reachable via this.iScroller
  * @class List component for android adapter with native-like scrolling.
  * @name adapters_android_uielements_list
  * @augments uielements_list
  */
  return Class(List,
      /**
      * @lends adapters_android_uielements_list.prototype
      */
      {
        /**
        * Get default options
        * @function
        * @return {Object} hash of options.
        */
        getDefaultOptions: function() {
          return _.extend(this.__super(), {
            orientation: 'up',
            incrementalRefresh: false,
            itemTemplate: "<li id='<%=itemHtmlId%>' data-josh-ui-path='<%= path %>' data-josh-grid-id='<%= item.id %>' class='josh-" + this.type + " joshover'><%= itemInner %></li>",
            scroller: true

          });
        },
        /**
        * Init scroll & subscribe to events
        * @param [scroller=false] {bool}: true if you want to make your list scrollable using iScroll.
        * @param [scrollBarClass] {String}: Css class to be applied on the scrollbar.
        * @param [scrollOptions] {Object} hash of options, specific to iScroll.
        * @param [scrollOptions.hScroll], used to disable the horizontal scrolling no matter what. By default you can pan both horizontally and vertically, by setting this parameter to false you may prevent horizontal scroll even if contents exceed the wrapper.
        * @param [scrollOptions.vScroll], same as above for vertical scroll.
        * @param [scrollOptions.hScrollbar], set this to false to prevent the horizontal scrollbar to appear.
        * @param [scrollOptions.vScrollbar], same as above for vertical scrollbar.
        * @param [scrollOptions.fixedScrollbar], on iOS the scrollbar shrinks when you drag over the scroller boundaries. Setting this to true prevents the scrollbar to move outside the visible area (as per Android). Default: true on Android, false on iOS.
        * @param [scrollOptions.fadeScrollbar], set to false to have the scrollbars just disappear without the fade effect.
        * @param [scrollOptions.hideScrollbar], the scrollbars fade away when there’s no user interaction. You may want to have them always visible. Default: true.
        * @param [scrollOptions.bounce], enable/disable bouncing outside of the boundaries. Default: true.
        * @param [scrollOptions.momentum], enable/disable inertia. Default: true. Useful if you want to save resources.
        * @param [scrollOptions.lockDirection], when you start dragging on one axis the other is locked and you can keep dragging only in two directions (up/down or left/right). You may remove the direction locking by setting this parameter to false.
        *
        * @param [defaultSelection] {Array} : [&nbsp;].
        * @param [itemInnerTemplate] {String} : &lt;=item.label%&gt;.
        * @param [loadingTemplate=Loading...] {String}
        */
        init: function() {
          var self = this;
          self.__super();

          self.scrollOptions = _.extend({},self.options.scrollOptions, {active: self.options.scroller || false});
          if (self.options.scrollBarClass) {
            self.scrollOptions.scrollbarClass = self.options.scrollBarClass;
          }

          self.setData(self.data);

          self.subscribe('focusItem', function(ev, data) {
            self._applyFocus(data[0]);
          });

          self.subscribe('input', function(ev, data) {
            //if (data.length == 2 && data[0] == 'enter') {
            if (data.length >= 2 && data[0] == 'enter') {
              if (data[1] == '__lastItem') {
                self.publish('lastItemSelect');
                return;
              }
              if (data[1] === undefined) return;
              self.selectById(data[1]);
            }
          });

          self.subscribe('beforeBlur', function(ev, data) {
            $('#' + self.htmlId + ' .focused').removeClass('focused');
          });

          self.subscribe('select', function(ev, data) {
            var ids = data[0];

            $('#' + self.htmlId + ' .selected').removeClass('selected');

            for (var i = 0, l = ids.length; i < l; i++) {
              $('#' + self.getItemHtmlId(ids[i])).addClass('selected');
            }
          });

        },

        insertScroller: function() {
          var self = this;

          if (!self.scrollOptions || !self.getState("inserted")) return;

          this.hasScroller = true;

          // compute the width of the inner elements and appy it to the container, to make the scroll works
          //$('.' + self.htmlId + '_scroller').width($('#' + self.htmlId + ' ul:first').width());
          
          // Why did we need to unsubscribe ???
          //self.unsubscribe(subAfterShow);
          if (self.scrollOptions.active && self.data && self.data.length && self.htmlEl.children.length) {
            if (self.iScroller) self.iScroller.destroy();
            self.iScroller = new iScroll(self.htmlId, self.scrollOptions);
            
            // until https://github.com/cubiq/iscroll/issues/90
            document.addEventListener("orientationChanged", function(e) {
              if (self.iScroller) self.iScroller.refresh();
            }); 
          }

        },

        /**
        * Insert list in its parent element
        * @function
        * @param {UIElement | HTMLElement} parentElement
        * @param {Function} callback
        */
        insert: function(parentElement, callback) {
          var self = this;
          document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);

          self.__super(parentElement, callback);

          self.subscribe('afterShow', function() {
            self.insertScroller();
          });

        },
        /**
        * @ignore
        *
        */
        _applyFocus: function(id) {
          var self = this;

          $('#' + self.htmlId + ' .focused').removeClass('focused');
          $('#' + self.getItemHtmlId(id)).addClass('focused');

          if (self.options.autoScroll) {
            // self.autoScroll();
          }
        },

        /**
        * Give focus to a specific item, using its index
        * @function
        * param {int} index
        */
        focusByIndex: function(index) {
          this.focusById(this.data[index].id);
        },

        /**
        * Gives focus to a specific item
        * @function
        * param {int} id
        */
        focusById: function(id) {
          if (this.getState('focus') == id) return;

          this.setState('focus', id);
          this.publish('focusItem', [id]);

          this.focus();
        },


        /////////////////// RENDERING FUNCTIONS ///////////////////////////////
        //TODO make sure they're unique
        /**
        * @function
        * @param {int} itemId
        * @return {string}
        *
        */
        getItemHtmlId: function(itemId) {
          return this.getHtmlId() + '_' + itemId.toString().replace(/[^-A-Za-z0-9_:.]/, '-');
        },
        /**
        * Returns inner html, depending of the isLoading state
        * @function
        * @return {string} inner html.
        */
        getInnerHtml: function() {
          if (this.isLoading) {
            return this.template(this.options.loadingTemplate);
          } else {
            return '<div class="' + this.htmlId + '_scroller"><ul>' + this._getItemsHtml(0) + '</ul></div>';
            //style="width:1000%;"
          }
        },

        /**
        * @ignore
        *
        */
        _getItemsHtml: function(itemFrom) {
          var ret = [];

          var tmpl = _.isFunction(this.options.itemTemplate) ? this.options.itemTemplate : _.template(this.options.itemTemplate);

          var tmplInner = _.isFunction(this.options.itemInnerTemplate) ? this.options.itemInnerTemplate : _.template(this.options.itemInnerTemplate);

          if (!this.data) {
            return '';
          }

          for (var i = itemFrom, l = this.data.length; i < l; i++) {
            this.item = this.data[i];
            this.i = i;
            this.itemInner = tmplInner(this);
            this.itemHtmlId = this.getItemHtmlId(this.data[i].id);
            ret.push(tmpl(this));
          }

          if (this.options.lastItemInnerTemplate) {
            var tmplLastInner = _.isFunction(this.options.lastItemInnerTemplate) ? this.options.lastItemInnerTemplate : _.template(this.options.lastItemInnerTemplate);

            this.item = {'id': '__lastItem'};
            this.i = 'last';
            this.itemInner = tmplLastInner(this);
            this.itemHtmlId = this.getItemHtmlId('__lastItem');
            ret.push(tmpl(this));
          }

          return ret.join('');
        },

        //setLoading:function() {},

        /**
        * @function
        *
        */
        refresh: function() {
          var self = this;

          if (this.options.incrementalRefresh && $('#' + this.htmlId + ' ul').size()) {

            //Try to sync HTML and data incrementally
            var maxSyncedIndex = 0;
            var liElements = $('#' + this.htmlId + ' li');
            if (liElements.slice){
              for (var i = 0; i < this.data.length; i++) {
                if (liElements.slice(i, i + 1).attr('data-josh-grid-id') != this.data[i].id) {
                  maxSyncedIndex = i;
                  break;
                }
                liElements.slice(maxSyncedIndex).remove();
              }
            }
            $('#' + this.htmlId + ' ul').append(this._getItemsHtml(maxSyncedIndex));
            this.publish('afterRefresh');

          } else {
            if (self.iScroller) {
              self.iScroller.destroy();
              self.iScroller = null;
            }
            this.__super();
            this.insertScroller();
          }

          setTimeout(function() {
            if (self.iScroller) self.iScroller.refresh();
          },0);


          var focus = this.getState('focus');
          if (focus) {
            this._applyFocus(focus);
          }
        },

        setLoading: function(isLoading) {

          if (this.iScroller && isLoading) {
            this.iScroller.destroy();
            this.iScroller = null;
          }
          this.__super(isLoading);

        }


      });
}
)(Joshfire.loadModule('joshfire/uielements/list'),Joshfire.loadModule('joshfire/class'),Joshfire.loadModule('joshfire/utils/grid'),Joshfire.loadModule('joshfire/vendor/underscore'),Joshfire.loadModule('joshfire/vendor/iscroll'),Joshfire.loadModule('joshfire/vendor/zepto'));
 };

Joshfire.definedModules['joshfire/adapters/ios/uielements/list'] = function() { return (
function(List, Class, _) {
  /**
  * @class List implementation for iOS
  * @name adapters_ios_uielements_list
  * @augments adapters_android_uielements_list
  */

  // We temporarily use the very same as on Android but moving to Scrollability and supporting
  // the new iOS5 'native' scrolling is planned.
  return List;
}
)(Joshfire.loadModule('joshfire/adapters/android/uielements/list'),Joshfire.loadModule('joshfire/class'),Joshfire.loadModule('joshfire/vendor/underscore'));
 };

Joshfire.definedModules['joshfire/uielements/panel.manager'] = function() { return (
function(Panel, Class, _) {
  /**
  * Panel Manager shows one of its children panel at a time<br />
  * The manager listens to a uiMaster, and change its active view depending of the select events fired by this master
  * @class Panel Manager base class
  * @name uielements_panel.manager
  * @augments uielements_panel
  */
  return Class(Panel,
      /**
      * @lends uielements_panel.manager.prototype
      */
      {
        /**
        * Initialize the panel manager<br />
        * If uiMaster, subscribe to masters' select event
        * @function
        *
        **/
        init: function() {
          var self = this;

          self.lastSequenceId = 0;

          self.subscribe('state', function(ev, data) {
            if (data[0] == 'route') {
              self.route(data[1]);
            }
          });

          self.currentId = false;

        },

        switchTo: function(finalPath) {
          var self = this;

          self.currentPanelId = finalPath;

          //Show panel.mgr item referenced by uimaster
          //Hide everybody else
          _.each(self.children, function(child) {
            if (child.path == self.path + '/' + finalPath) {
              self.app.ui.element(child.path).show();
            } else {
              self.app.ui.element(child.path).hide();
            }
          });
        },

        setup: function(callback) {
          var self = this;

          if (self.options.uiMaster) {
            self.app.ui.fetch(self.options.uiMaster, false, function(error, item) {
              var uiMaster = self.app.ui.element(self.options.uiMaster);

              uiMaster.subscribe('select', function(ev, data) {
                //Check target exists
                if (!data.length || self.app.ui.get(self.path + '/' + data[0][0]) === undefined) {
                  return false;
                }

                self.switchTo(data[0][0]);

                return true;
              });
            });
          }

          callback();
        },

        /**
        * Init view
        * @function
        * @param {string} view
        * @param {Function} callback, called after init.
        **/
        initView: function(view, callback) {
          var self = this;

          if (_.isString(view)) {
            //todo cache view classes
            Joshfire.require([this.options.requirePrefix + view], function(viewClass) {
              if (!viewClass) {
                return callback('no such view');
              }
              var elt = new viewClass(self.app, self.path + '/' + view, {
                sequenceId: self.lastSequenceId++
              });
              return callback(null, elt);
            });
          }
        }
      });
}
)(Joshfire.loadModule('joshfire/uielements/panel'),Joshfire.loadModule('joshfire/class'),Joshfire.loadModule('joshfire/vendor/underscore'));
 };

Joshfire.definedModules['joshfire/uielements/button'] = function() { return (
function(UIElement, Class) {
  /**
  * @class Button base class
  * @name uielements_button
  * @augments uielement
  */
  return Class(UIElement,
      /**
      * @lends uielements_button.prototype
      */
      {
        type: 'Button',

        /**
        * The html rendering of a Button. &lt;input type=button value={this.label} /&gt;
        * @function
        * @return {String} a classic &lt;input type=button /&gt;.
        */
        getHtml: function() {
          return this.template('<input type="button" class="joshover josh-type-<%=type%> josh-id-<%=id%> <%= htmlClass %>"  data-josh-ui-path="' + this.path + '" id="' + this.htmlId + '" value="' + this.options.label + '" />');
        },

        /**
        * Set button label
        * @function
        */
        setLabel: function(label) {
          this.htmlEl.value = label;
        },

        /**
        * Inherits uielement.init()
        * Subscribe to input event, if 'enter', publish select event
        * @function
        */
        init: function() {
          var self = this;
          self.__super();
          self.subscribe('input', function(ev, data) {
            if (!data || data.length == 0) {
              return;
            }
            switch (data[0]) {
              case 'enter':
                self.publish('select', [self.id]);
            }
          });
        }
      }
  );
}
)(Joshfire.loadModule('joshfire/adapters/ios/uielement'),Joshfire.loadModule('joshfire/class'));
 };

Joshfire.definedModules['src/api/joshfire.me'] = function() { return (
function(DataSource,_) {
  var datasource = new DataSource();
  var TRUE_APIROOT_JOSHME = 'http://joshfire.com:40008/data/';
  var APIROOT_JOSHME = '/proxy/';

  return {
    query: function(url, data, callback) {
      datasource.request({
        url: APIROOT_JOSHME,
        data: {'data': data, 'url': TRUE_APIROOT_JOSHME + url},
        type: 'POST',
        cache: 'no',
        jsonp: 'callback'
      },
      function (error, data) {
        if (error) {
          return callback(error, null);
        }
        var json = {};
        try {
          json = JSON.parse(data);
        } catch(e) {
          console.warn('invalid json', data);
        }
        return callback(null, json);
      });
    },

    getData: function(app, user_id, callback){
      this.query('get', {appId: app.id, userId: user_id}, callback);
    },

    setData: function(app, user_id, data, callback){
      this.query('set', {appId: app.id, userId: user_id, data: data}, function() {
        callback();
      });
    }
  };
}
)(Joshfire.loadModule('joshfire/adapters/ios/utils/datasource'),Joshfire.loadModule('joshfire/vendor/underscore'));
 };

Joshfire.definedModules['src/templates_compiled/js/about'] = function() { return (
function() {return function(obj) {
var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div style="padding:20px;text-align:center">\n\n\n<img src="images/powered/powered-iPad.png" style="padding:20px;margin:0 auto;width:90px;height:31px;"/>\n\n<p>\nCette application a été développée en utilisant la solution open-source <a href="http://framework.joshfire.com/">Joshfire Framework</a>.\n</p>\n\n<p>Il permet à chaque organisateur de conférence TEDx de créer une application pour tous les supports</p>\n\n<p>Pour plus d\'information, rendez-vous sur la page github: <a href="http://github.com/joshfire/mytv">http://github.com/joshfire/mytv</a></p>\n\n<br/><br/>\n\n<!--\n<b>About TEDx, x=independently organized event</b>\n<p>In the spirit of ideas worth spreading, TEDx is a program of\nlocal, self-organized events that bring people together to share\na TED-like experience. At a TEDx event, TEDTalks video and live\nspeakers combine to spark deep discussion and connection in a\nsmall group. These local, self-organized events are branded TEDx,\nwhere x=independently organized TED event.</p>\n<p>The TED Conference provides general guidance for the TEDx\nprogram, but individual TEDx events are self-organized.*\n(*Subject to certain rules and regulations)</p>\n\n<b>About TED</b>\n<p>TED is an annual event where some of the world’s leading\nthinkers and doers are invited to share what they are most\npassionate about. “TED” stands for Technology, Entertainment,\nDesign — three broad subject areas that are, collectively,\nshaping our future. And in fact, the event is broader still,\nshowcasing ideas that matter in any discipline. Attendees have\ncalled it “the ultimate brain spa” and “a four-day journey into\nthe future.” The diverse audience — CEOs, scientists, creatives,\nphilanthropists — is almost  as extraordinary as the speakers,\nwho have included Bill Clinton, Bill Gates, Jane Goodall,\nFrank Gehry, Paul Simon, Sir Richard Branson, Philippe Starck\nand Bono.</p>\n<p>TED was ﬁrst held in Monterey, California, in 1984. In 2001,\nChris Anderson’s Sapling Foundation acquired TED from its\nfounder, Richard Saul Wurman. In recent years, TED has expanded\nto include an international conference, TEDGlobal;\nmedia initiatives, including TED Talks and TED.com;\nand the TED Prize. TED2010, “What the world Needs Now,”\nwill be held Springs, California.</p>\n-->\n\n</div>');}return __p.join('');
}}
)();
 };

Joshfire.definedModules['src/tree.ui'] = function() { return (
function(Class, UITree, List, Panel, PanelManager, Button, TEDApi,JoshmeAPI,  _, TemplateAbout) {
  window._ = _;

  return Class(UITree, {     
    buildTree: function() {
      // UI specialization : the video list scrolls from top to bottom only on iOS
      var bVerticalList = (Joshfire.adapter === 'ios') ? true : false;

      var app = this.app;
      
      if (!TEDXID) {
        app.mainVideoListDataPath = "/talks/latest/";
      }

      // our UI definition
      var aUITree = [
        {
          id: 'toolbar',
          type: Panel,
          hideOnBlur: false,
          content: '<h1>myTED.tv</h1>',
          children: [
          {
            id: 'loginButton',
            type: Panel,
            autoShow:!TEDXID,
            content:'Wait...'
          }],
          onAfterInsert: function(ui) {
            //register onclick on login button
            //iPad browser blocks facebook popup when coming from ..subscribe('input') :-(
              
              //  app.fbLogin();
              // ... Forget that ...
              // Works fine in iOS Safari.. but not in a web app = launched from home screen
              // Let's try direct link
              //ui.htmlEl.onclick = function() {};
          }
        },
        {
          id: 'main',
          type: PanelManager,
          uiMaster: '/footer',
          children: [
          {
            id: 'home',
            type: Panel,
            onAfterShow: function(ui) {
              // propagate event to child list for scroller refresh
              app.ui.element('/main/home/videodetail').publish('afterShow');
              app.ui.element('/main/home/videolistpanel/videolist').publish('afterShow');
            },
            children:[
              {
                id: 'videolistpanel',
                type: Panel,
                onAfterShow: function(ui) {
                  // propagate event to child list for scroller refresh
                  app.ui.element('/main/home/videolistpanel/videolist').publish('afterShow');
                },
                children: [
                  {
                    id: 'videolisttitle',
                    type: Panel,
                    innerTemplate: '<p class="theme-title"><%= data.label ? data.label : "Latest videos"  %></p>'
                  },
                  {
                    id: 'videolist',
                    type: List,
                    loadingTemplate: '<div style="padding:40px;">Loading...</div>',
                    dataPath: app.mainVideoListDataPath,
                    incrementalRefresh: true,
                    lastItemInnerTemplate: "<button class='more'>Show more!</button>",
                    onLastItemSelect: function(me) {
                      $('#' + me.htmlId + '___lastItem button', $('#' + me.htmlId)).html("Loading...");
                      app.data.fetch(me.dataPath, {skip: me.data.length}, function(newData) {
                          if (!newData || newData.length == 0){
                            $('#' + me.htmlId + '___lastItem', $('#' + me.htmlId)).remove();
                          }
                      });
                    },
                    onState:function(ui,ev,data) {
                      
                      //When dataPath changes, select the first item.
                      if (data[0] == 'dataPath') {
                        if (BUILDNAME != 'iphone' && BUILDNAME != 'androidphone') {
                          var token = ui.subscribe("data",function() {
                            ui.unsubscribe(token);
                            ui.selectByIndex(0);
                          });
                        }

                        // No "show more" for TEDx
                        if (data[1].match(/^\/tedx/)) {
                          ui.options.lastItemInnerTemplate = false;
                        } else {
                          ui.options.lastItemInnerTemplate = "<button class='more'>Show more!</button>";
                        }

                        app.ui.element("/main/home/videolistpanel/videolisttitle").setDataPath(data[1].substring(0,data[1].length-1));
                      }
                    },
                    onSelect: function(ui, type, data) {
                      if (BUILDNAME == 'iphone' || BUILDNAME == 'androidphone') {
                          app.ui.element('/main/home/videodetail/videoshortdesc').hide();
                          app.ui.element('/main/home/videodetail').show();
                          app.ui.element('/main/home/videodetail/close').show();
                          app.ui.element('/main/home/videolistpanel').hide();
                         
                          //Wait for data to update. TODO remove the setTimeout with a more precise event.
                          setTimeout(function() {
                            app.ui.element('/main/home/videodetail/videoshortdesc').onState("fresh",true,function() {
                              app.ui.element('/main/home/videodetail/videoshortdesc').show();
                            });
                          },250);
                        
                      }
                    },
                    autoShow: true,
                    // modify default content of the <li>. item correspond to the childrens of videos/ in the data tree
                    itemInnerTemplate: '<figure><img src="<%= item.image %>"/><figcaption><%= item.label %><br><span class="talker"><%= item.talker?"par "+item.talker.name:"" %></span></figcaption></figure>',
                    scroller: true,
                    scrollOptions: {
                      // do scroll in only one direction
                      vScroll: bVerticalList,
                      hScroll: !bVerticalList
                    },
                    scrollBarClass: 'scrollbar',
                    autoScroll: true
                  }
                ]
              },
              {
                id: 'videodetail',
                type: Panel,
                hideOnBlur: true,
                template: "<div id='myTED__detailswrapper'><div style='display:none;' class='josh-type-<%=type%> josh-id-<%=id%>' id='<%= htmlId %>' data-josh-ui-path='<%= path %>'><div id='video-logo-ted'></div><%= htmlOuter %></div></div>",
                uiDataMaster: '/main/home/videolistpanel/videolist',
                autoShow: (BUILDNAME != 'iphone' && BUILDNAME != 'androidphone'),
                forceDataPathRefresh: true,
                onAfterShow: function(ui) {
                  var selected = app.ui.element('/footer').htmlEl.querySelector('.selected');
                  if (selected) {
                    var currentPanel = selected.getAttribute('id').replace(/(.*)_/, '');
                    if (currentPanel == 'home' && (BUILDNAME != 'iphone' && BUILDNAME != 'androidphone')) {
                      app.ui.element('/main/home/videodetail/close').hide();
                    } else {
                      app.ui.element('/main/home/videodetail/close').show();
                    }
                  }
                },
                onData: function(ui) {
                  var player = app.ui.element('/main/home/videodetail/player');
                  var playerYT = app.ui.element('/main/home/videodetail/player.youtube');
                  
                  if (ui.data) {
                    if (ui.data.source=="youtube") {
                      playerYT.show();
                      player.hide();
                      player.stop();
                      app.ui.element('/main/home/videodetail/info/videoinfo').htmlEl.style.width="100%";
                      app.ui.element('/main/home/videodetail/info/talkerinfo').hide();
                      app.ui.element('/main/home/videodetail/like').hide();
                      
                      playerYT.playWithStaticUrl(ui.data);
                    } else {
                      var player = app.ui.element('/main/home/videodetail/player'),
                          play = function() {
                            player.playWithStaticUrl(ui.data.video['240']);
                            player.pause();
                          };
                          
                      player.show();
                      playerYT.hide();
                      playerYT.stop();
                      app.ui.element('/main/home/videodetail/info/videoinfo').htmlEl.style.width="50%";
                      app.ui.element('/main/home/videodetail/info/talkerinfo').show();
                      
                      if (!TEDXID) app.ui.element('/main/home/videodetail/like').show();
                      
                      if (ui.data.video) {
                        play();
                      } else {
                        TEDApi.getVideo(ui.data.key, function(error, vdata) {
                          ui.data.video = _.reduce(vdata, function(m, v) { m[v.format] = { url: v.url }; return m; }, {});
                          play();
                        });
                      }
                    }
                    
                    //like icon
                    if (app.userSession && app.userSession.mytv && app.userSession.mytv.favorites){
                       if (!app.data.get('/talks/favorites/')){
                         //Update my favs
                          app.data.set('/talks/favorites/', 
                          _.select(app.data.get('/talks/all/'), 
                             function (item){
                               return _.contains(app.userSession.mytv.favorites, item.id);
                             }
                           )
                          );
                        }
                      
                      if (_.include(app.userSession.mytv.favorites, ui.data.id)){
                         $('#'+app.ui.element('/main/home/videodetail/like').htmlId).addClass('liked');
                      }
                      else{
                        $('#'+app.ui.element('/main/home/videodetail/like').htmlId).removeClass('liked');
                      }
                    } else {
                      $('#'+app.ui.element('/main/home/videodetail/like').htmlId).removeClass('liked');
                    }
                  }

                  app.ui.element('/main/favorites/favlist').setDataPath('/talks/favorites');
                  
                },
                children:[
                  {
                    id: 'like',
                    type: Button,
                    autoShow:!TEDXID, //no favorites in TEDx mode
                    label: ''
                  },
                  {
                    id: 'close',
                    type: Button,
                    label: 'Retour',
                    autoShow: false,
                    onSelect: function(ui, type, data, token) {
                      app.ui.element('/main/home/videodetail/player').pause();
                      if (BUILDNAME == 'iphone' || BUILDNAME == 'androidphone') {
                        app.ui.element('/main/home/videodetail').hide();
                        app.ui.element('/main/home/videolistpanel').show();
                      }
                      var currentPanel = app.ui.element('/footer').getState('selection')[0];
                      app.ui.element('/main').switchTo(currentPanel);
                    }
                  },
                  {
                    id: 'player',
                    type: 'video.mediaelement',
                    autoShow: true,
                    controls: true,
                    noAutoPlay: false,
                    onAfterInsert: function(self) {
                      (function timer_daemon() {
                        setTimeout(function() {
                        var video = self.app.ui.element('/main/home/videodetail/player').htmlEl.querySelector('video');
                        if (self.app.userSession && video && !video.paused){
                           //Do your thing
                           var video_id=self.app.ui.element('/main/home/videodetail').dataPath.match(/[0-9]+$/)[0];
                            JoshmeAPI.setData(self.app,self.app.userSession.uid, {currentVideo:video_id, time:Math.floor(video.currentTime*100)/100}, function (err, retour){
                          });
                           
                           
                        }
                         timer_daemon();
                        } , 1000);
                      })();
                    }
                  },
                  {
                    id: 'player.youtube',
                    type: 'video.youtube',
                    autoShow: true,
                    controls: true,
                    noAutoPlay: false,
                    width:(BUILDNAME == 'ipad') ? 460 : false,
                    onAfterInsert:function(self){}
                  },
                  {
                    id: 'videoshortdesc',
                    type: Panel,
                    uiDataSync: '/main/home/videodetail',
                    innerTemplate:
                      '<h1><%= data.label %></h1>'+
                      '<%= data.talker ? "<h2>par "+data.talker.name+"</h2>" : "" %>'
                  },
                  {
                    id: 'info',
                    type: Panel,
                    uiDataSync:'/main/home/videodetail',
                    children: [
                      {
                        id: 'videoinfo',
                        type: Panel,
                        uiDataSync:'/main/home/videodetail',
                        innerTemplate:
                          '<h1 class="label"></h1>'+
                          '<p class="description"><%= data.summary %></p>'
                      },
                      {
                        id: 'talkerinfo',
                        type: Panel,
                        uiDataSync:'/main/home/videodetail',
                        innerTemplate:
                          '<h1 class="name"><%= data.talker ? data.talker.name : "" %></h1>'+
                          '<p class="description"><%= data.talker ? data.talker.shortsummary : "" %></p>'
                      }
                    ]
                  }
                ]//fin children videodetail
              }//fin video detail
            ]//fin children home
            },//fin home
            {
              id: 'themes',
              type: Panel,
              content: '',
              autoShow:false,
              onAfterShow: function(ui) {
                // propagate event to child list for scroller refresh
                app.ui.element('/main/themes/themeslist').publish('afterShow');
              },
              children: [{
                id: 'themeslist',
                type: List,
                dataPath: '/themes/',
                incrementalRefresh: true,
                autoShow: true,
                // modify default content of the <li>. item correspond to the childrens of videos/ in the data tree
                itemInnerTemplate: '<figure data-id="<%= item.id %>"><img src="<%= item.image ? item.image : "http://placehold.it/208x142" %>"/><figcaption><%= item.label %></figcaption></figure>',
                scroller: true,
                scrollOptions: {
                  // do scroll in only one direction
                  vScroll: bVerticalList,
                  hScroll: !bVerticalList
                },
                scrollBarClass: 'scrollbar',
                autoScroll: true,
                onSelect: function(ui, evt, data) {
                  var videolist = app.ui.element('/main/home/videolistpanel/videolist');
                  videolist.setDataPath('/themes/' + data[0]);
                  
                  app.ui.element('/main').switchTo("home");
                  
                }
              }]
            },
            {
              id: 'tedx',
              type: Panel,
              content: '',
              autoShow:false,
              onAfterShow: function(ui) {
                // propagate event to child list for scroller refresh
                app.ui.element('/main/tedx/tedxlist').publish('afterShow');
              },
              children: [{
                id: 'tedxlist',
                type: List,
                dataPath: '/tedx/',
                incrementalRefresh: true,
                autoShow: true,
                // modify default content of the <li>. item correspond to the childrens of videos/ in the data tree
                itemInnerTemplate: '<figure data-id="<%= item.id %>"><img src="<%= item.image ? item.image : "http://placehold.it/208x142" %>"/><figcaption><%= item.label %></figcaption></figure>',
                scroller: true,
                scrollOptions: {
                  // do scroll in only one direction
                  vScroll: bVerticalList,
                  hScroll: !bVerticalList
                },
                scrollBarClass: 'scrollbar',
                autoScroll: true,
                onSelect: function(ui, evt, data) {
                  var videolist = app.ui.element('/main/home/videolistpanel/videolist');
                  videolist.setDataPath('/tedx/' + data[0]);
                  
                  app.ui.element('/main').switchTo("home");
            
                }
              }]
            },
            
            {
              id: 'twitter',
              type: Panel,
              content: '',
              autoShow:false,
              onAfterShow: function(ui) {
                // propagate event to child list for scroller refresh
                app.ui.element('/main/tedx/tedxlist').publish('afterShow');
              },
              children: [{
                id: 'twitterlist',
                type: List,
                dataPath: false,
                incrementalRefresh: true,
                autoShow: true,
                // modify default content of the <li>. item correspond to the childrens of videos/ in the data tree
                //itemInnerTemplate: '<figure data-id="<%= item.id %>"><img src="<%= item.image ? item.image : "http://placehold.it/208x142" %>"/><figcaption><%= item.label %></figcaption></figure>',
                scroller: true,
                scrollOptions: {
                  // do scroll in only one direction
                  vScroll: bVerticalList,
                  hScroll: !bVerticalList
                },
                scrollBarClass: 'scrollbar',
                autoScroll: true
              }]
            },
            
            {
              id: 'favorites',
              type: Panel,
              autoShow:false,
              onAfterShow: function(ui) {
                // propagate event to child list for scroller refresh
                app.ui.element('/main/favorites/favlist').publish('afterShow');
              },
              children: [
                {
                  id: 'mytitle',
                  type: Panel,
                  innerTemplate: '<div class="title-wrapper"><p class="theme-title">My favorites</p></div><div class="fav-not-connected"><h3>You should be connected !</a></h3></div><div class="fav-zero-favs"><h3>No favorites yet !</a></h3></div>'
                },
                {
                  id: 'favlist',
                  type: List,
                  autoShow: true,
                  loadingTemplate: '<div style="padding:40px;">...No favorites yet...</div>',
                  
                  // modify default content of the <li>. item correspond to the childrens of videos/ in the data tree
                  itemInnerTemplate: '<figure><img src="<%= item.image %>"/><figcaption><%= item.label %><br><span class="talker"><%= item.talker?"par "+item.talker.name:"" %></span></figcaption></figure>',
                  scroller: true,
                  scrollOptions: {
                    // do scroll in only one direction
                    vScroll: bVerticalList,
                    hScroll: !bVerticalList
                  },
                  scrollBarClass: 'scrollbar',
                  autoScroll: true,
                  onSelect:function(ui,event, data){
                    var video_id = data[0][0],path='/talks/latest/';
                    //Change videolist dataPath
                     var videolist = app.ui.element('/main/home/videolistpanel/videolist');
                      videolist.setDataPath('/talks/favorites');

                    //Change video dataPath
                    var video = app.data.get(path+video_id);
                    if (!video){
                      path='/talks/all/';
                      video = app.data.get(path+video_id);
                    }
                    if (!video){
                      alert('An error occured - unable to play video '+video_id);
                      return false;
                    }

                    app.ui.element('/main/home/videodetail').setDataPath(path+video_id);
                    //Change main view
                    
                    app.ui.element('/main').switchTo("home");
                    
                  }
                }
              ],
              onAfterShow:function(ui){
                  app.ui.element('/main/home/videodetail/player').player.pause();
                  if (!app.getState('auth')) {
                    $('#'+ui.htmlId+' .fav-zero-favs').hide();
                    app.fbLogin();
                  } else {
                    $('#'+ui.htmlId+' .fav-not-connected').hide();
                    if (app.ui.element('/main/favorites/favlist').data && app.ui.element('/main/favorites/favlist').data .length>0){
                      $('#'+ui.htmlId+' .fav-zero-favs').hide();
                    }
                    //OK here come your videos
                   // app.ui.element('/main/favorites').htmlEl.innerHTML = '<h3>Favs to show</h3>'+JSON.stringify(app.userSession.mytv.favorites);
                  }
              }
            },
            {
              id:"about",
              type:Panel,
              content:TemplateAbout()
            }
          ]//fin children main
        },//main
        {
          id: 'footer',
          type: List,
          hideOnBlur: false,
          content: '',
          onSelect: function(ids) {
            
            if (ids[0]!="home" && app.mainVideoListDataPath) {
              app.ui.element('/main/home/videolistpanel/videolist').setDataPath(app.mainVideoListDataPath);
            }
            
            if (ids[0]!="home") {
              app.ui.element('/main/home/videodetail/player').pause();
            }
            
          },
          data: []
        }
      ];
      // UI specialization : the video control bar is useless on environments without a mouse
      //console.log(Joshfire.adapter);
      if (Joshfire.adapter === 'browser') {
        aUITree.push({
          id: 'controls',
          type: 'mediacontrols',
          media: '/player',
          hideDelay: 5000
        });
      }
      return aUITree;
    }
  });
}
)(Joshfire.loadModule('joshfire/class'),Joshfire.loadModule('joshfire/tree.ui'),Joshfire.loadModule('joshfire/adapters/ios/uielements/list'),Joshfire.loadModule('joshfire/uielements/panel'),Joshfire.loadModule('joshfire/uielements/panel.manager'),Joshfire.loadModule('joshfire/uielements/button'),Joshfire.loadModule('src/api/ted'),Joshfire.loadModule('src/api/joshfire.me'),Joshfire.loadModule('joshfire/vendor/underscore'),Joshfire.loadModule('src/templates_compiled/js/about'));
 };

Joshfire.definedModules['joshfire/utils/splashscreen'] = function() { return (
function(Class, _) {


  return Class(
      /**
      * @lends utils_splashscreen.prototype
      */
      {

        /**
        * @constructs
        * @class Splashscreen util
        * @param {Object} options
        */
        __constructor: function(options) {
          options = _.extend({
            'htmlId': 'splashscreen'
          }, options);
          this.id = options.htmlId;

          if (options.timeout) {
            var self = this;
            setTimeout(function() {
              self.remove();
            }, options.timeout);
          }


        },

        /**
        * @function
        * @param {Object} options
        */
        remove: function(options) {
          //Options : transition,
          if (document) {
            document.getElementById(this.id).style.display = 'none';
          }
        }
      });

}
)(Joshfire.loadModule('joshfire/class'),Joshfire.loadModule('joshfire/vendor/underscore'));
 };

Joshfire.definedModules['src/app'] = function() { return (
function(App, Class, Data, UI, _, Splash) {

  return Class(App, {
    id: 'myTEDtv',
    uiClass: UI,
    dataClass: Data,
    setup: function(callback) {
      var self = this;
      
      this.splash = new Splash();
          
      if (TEDXID) {
        //Load TEDx events. setTEDxMode() will be called.
        this.data.fetch("/tedx/",false,function() {
          
        });
        
      } else {
        var videolist = self.ui.element('/main/home/videolistpanel/videolist');
        
        videolist.subscribe('data', function(ev, data, token) {
          videolist.unsubscribe(token);

          self.ui.setState('focus', '/main/home/videolistpanel/videolist');
          if (BUILDNAME != 'iphone' && BUILDNAME != 'androidphone')
            videolist.selectByIndex(0);
          self.ui.element('/footer').selectById("home");
          self.splash.remove();
        });
        
        self.ui.element('/footer').setData([{
          id: 'home',
          label: 'Latest'
        },
        {
          id: 'themes',
          label: 'Themes'
        },
        {
          id: 'tedx',
          label: 'TEDx'
        },
        {
          id: 'favorites',
          label: 'My favorites'
        },
        {
          id: 'about',
          label: 'About'
        }
        ]);

      }
      
      if (callback) {
        callback(null);
      }
      
    },
    
    //Called only in TEDx mode when list of TEDx events has been loaded.
    setTEDxMode: function(tedxinfos) {
      var self = this;
      
      if (this.tedxmeta) return;
      this.tedxmeta = tedxinfos;
      
      self.ui.element('/toolbar').onState("inserted",true,function() {
        
        document.getElementsByTagName('title')[0].innerText = tedxinfos.title;
        self.ui.element('/toolbar').htmlEl.firstChild.innerText = tedxinfos.title;

        self.data.fetch('/tedx/', false, function(err, tedxevents) {

          var footerData = [];
          if (tedxevents.length) {
            self.mainVideoListDataPath = "/tedx/"+tedxevents[0].id+"/";
            self.ui.element("/main/home/videolistpanel/videolist").setDataPath(self.mainVideoListDataPath);
          
          
            if (tedxevents.length==1) {
               footerData.push({
                  id: 'home',
                  label: 'Videos'
              });
            } else {
              footerData.push({
                  id: 'tedx',
                  label: 'Évènements'
              });
            }
          }

          footerData.push({
              id: 'about',
              label: 'À propos'
          });

          
          
          
          /*
          if (tedxinfos.twitter) {
            footerData.push({
              id: 'twitter',
              label: 'Twitter'
            });
            self.ui.element('/main/twitter/twitterlist').setDataPath("/twitter/");
          }
          */
          
          self.ui.element('/footer').setData(footerData);

          // Auto-select if only one TEDx event
          if (tedxevents && tedxevents.length == 1) {
            self.ui.element('/footer').selectById('home');
            self.ui.element('/main/tedx/tedxlist').selectByIndex(0);
          } else {
            self.ui.element('/footer').selectById('tedx');
          }

          self.splash.remove();
        });
        
      });
      
    }
  });
}
)(Joshfire.loadModule('joshfire/adapters/ios/app'),Joshfire.loadModule('joshfire/class'),Joshfire.loadModule('src/tree.data'),Joshfire.loadModule('src/tree.ui'),Joshfire.loadModule('joshfire/vendor/underscore'),Joshfire.loadModule('joshfire/utils/splashscreen'));
 };

Joshfire.definedModules['src/vendor/add2home'] = function() { return (
function() {

/**
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Copyright (c) 2011 Matteo Spinelli, http://cubiq.org/
 * Released under MIT license
 * http://cubiq.org/dropbox/mit-license.txt
 * 
 * Version 1.0.7 - Last updated: 2011.07.12
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * 
 */

var nav = navigator,
	isIDevice = (/iphone|ipod|ipad/gi).test(nav.platform),
	isIPad = (/ipad/gi).test(nav.platform),
	isRetina = 'devicePixelRatio' in window && window.devicePixelRatio > 1,
	isSafari = nav.appVersion.match(/Safari/gi),
	hasHomescreen = 'standalone' in nav && isIDevice,
	isStandalone = hasHomescreen && nav.standalone,
	OSVersion = nav.appVersion.match(/OS \d+_\d+/g),
	platform = nav.platform.split(' ')[0],
	language = nav.language.replace('-', '_'),
	startY = startX = 0,
	expired = localStorage.getItem('_addToHome'),
	theInterval, closeTimeout, el, i, l,
	options = {
		animationIn: 'drop',		// drop || bubble || fade
		animationOut: 'fade',		// drop || bubble || fade
		startDelay: 2000,			// 2 seconds from page load before the balloon appears
		lifespan: 20000,			// 20 seconds before it is automatically destroyed
		bottomOffset: 14,			// Distance of the balloon from bottom
		expire: 0,					// Minutes to wait before showing the popup again (0 = always displayed)
		message: '',				// Customize your message or force a language ('' = automatic)
		touchIcon: false,			// Display the touch icon
		arrow: true,				// Display the balloon arrow
		iterations:100				// Internal/debug use
	},
	/* Message in various languages, en_us is the default if a language does not exist */
	intl = {
		ca_es: 'Per instal·lar aquesta aplicació al vostre %device premeu %icon i llavors <strong>Afegir a pantalla d\'inici</strong>.',
		da_dk: 'Tilføj denne side til din %device: tryk på %icon og derefter <strong>Tilføj til hjemmeskærm</strong>.',
		de_de: 'Installieren Sie diese App auf Ihrem %device: %icon antippen und dann <strong>Zum Home-Bildschirm</strong>.',
		el_gr: 'Εγκαταστήσετε αυτήν την Εφαρμογή στήν συσκευή σας %device: %icon μετά πατάτε <strong>Προσθήκη σε Αφετηρία</strong>.',
		en_us: 'Install this web app on your %device: tap %icon and then <strong>Add to Home Screen</strong>.',
		es_es: 'Para instalar esta app en su %device, pulse %icon y seleccione <strong>Añadir a pantalla de inicio</strong>.',
		fi_fi: 'Asenna tämä web-sovellus laitteeseesi %device: paina %icon ja sen jälkeen valitse <strong>Lisää Koti-valikkoon</strong>.',
		fr_fr: 'Ajoutez cette application sur votre %device en cliquant sur %icon, puis <strong>Ajouter à l\'écran d\'accueil</strong>.',
		he_il: '<span dir="rtl">התקן אפליקציה זו על ה-%device שלך: הקש %icon ואז <strong>הוסף למסך הבית</strong>.</span>',
		hu_hu: 'Telepítse ezt a web-alkalmazást az Ön %device-jára: nyomjon a %icon-ra majd a <strong>Főképernyőhöz adás</strong> gombra.',
		it_it: 'Installa questa applicazione sul tuo %device: premi su %icon e poi <strong>Aggiungi a Home</strong>.',
		ja_jp: 'このウェブアプリをあなたの%deviceにインストールするには%iconをタップして<strong>ホーム画面に追加</strong>を選んでください。',
		ko_kr: '%device에 웹앱을 설치하려면 %icon을 터치 후 "홈화면에 추가"를 선택하세요',
		nb_no: 'Installer denne appen på din %device: trykk på %icon og deretter <strong>Legg til på Hjem-skjerm</strong>',
		nl_nl: 'Installeer deze webapp op uw %device: tik %icon en dan <strong>Zet in beginscherm</strong>.',
		pt_br: 'Instale este web app em seu %device: aperte %icon e selecione <strong>Adicionar à Tela Inicio</strong>.',
		pt_pt: 'Para instalar esta aplicação no seu %device, prima o %icon e depois o <strong>Adicionar ao ecrã principal</strong>.',
		ru_ru: 'Установите это веб-приложение на ваш %device: нажмите %icon, затем <strong>Добавить в «Домой»</strong>.',
		sv_se: 'Lägg till denna webbapplikation på din %device: tryck på %icon och därefter <strong>Lägg till på hemskärmen</strong>.',
		th_th: 'ติดตั้งเว็บแอพฯ นี้บน %device ของคุณ: แตะ %icon และ <strong>เพิ่มที่หน้าจอโฮม</strong>',
		tr_tr: '%device için bu uygulamayı kurduktan sonra %icon simgesine dokunarak <strong>Ev Ekranına Ekle</strong>yin.',
		zh_cn: '您可以将此应用程式安装到您的 %device 上。请按 %icon 然后点选<strong>添加至主屏幕</strong>。',
		zh_tw: '您可以將此應用程式安裝到您的 %device 上。請按 %icon 然後點選<strong>加入主畫面螢幕</strong>。'
	};

OSVersion = OSVersion ? OSVersion[0].replace(/[^\d_]/g,'').replace('_','.')*1 : 0;
expired = expired == 'null' ? 0 : expired*1;

// Merge options
if (window.addToHomeConfig) {
	for (i in window.addToHomeConfig) {
		options[i] = window.addToHomeConfig[i];
	}
}

// Is it expired?
if (!options.expire || expired < new Date().getTime()) {
	expired = 0;
}

/* on DOM ready */
function ready () {
	document.removeEventListener('DOMContentLoaded', ready, false);

	var div = document.createElement('div'),
		close,
		link = options.touchIcon ? document.querySelectorAll('head link[rel=apple-touch-icon],head link[rel=apple-touch-icon-precomposed]') : [],
		sizes, touchIcon = '';

	div.id = 'addToHomeScreen';
	div.style.cssText += 'position:absolute;-webkit-transition-property:-webkit-transform,opacity;-webkit-transition-duration:0;-webkit-transform:translate3d(0,0,0);';
	div.style.left = '-9999px';		// Hide from view at startup

	// Localize message
	if (options.message in intl) {		// You may force a language despite the user's locale
		language = options.message;
		options.message = '';
	}
	if (options.message == '') {		// We look for a suitable language (defaulted to en_us)
		options.message = language in intl ? intl[language] : intl['en_us'];
	}

	// Search for the apple-touch-icon
	if (link.length) {
		for (i=0, l=link.length; i<l; i++) {
			sizes = link[i].getAttribute('sizes');

			if (sizes) {
				if (isRetina && sizes == '114x114') { 
					touchIcon = link[i].href;
					break;
				}
			} else {
				touchIcon = link[i].href;
			}
		}

		touchIcon = '<span style="background-image:url(' + touchIcon + ')" class="touchIcon"></span>';
	}

	div.className = (isIPad ? 'ipad' : 'iphone') + (touchIcon ? ' wide' : '');
	div.innerHTML = touchIcon + options.message.replace('%device', platform).replace('%icon', OSVersion >= 4.2 ? '<span class="share"></span>' : '<span class="plus">+</span>') + (options.arrow ? '<span class="arrow"></span>' : '') + '<span class="close">\u00D7</span>';

	document.body.appendChild(div);
	el = div;

	// Add the close action
	close = el.querySelector('.close');
	if (close) close.addEventListener('click', addToHomeClose, false);

	// Add expire date to the popup
	if (options.expire) localStorage.setItem('_addToHome', new Date().getTime() + options.expire*60*1000);
}


/* on window load */
function loaded () {
	window.removeEventListener('load', loaded, false);

	setTimeout(function () {
		var duration;
		
		startY = isIPad ? window.scrollY : window.innerHeight + window.scrollY;
		startX = isIPad ? window.scrollX : Math.round((window.innerWidth - el.offsetWidth)/2) + window.scrollX;

		el.style.top = isIPad ? startY + options.bottomOffset + 'px' : startY - el.offsetHeight - options.bottomOffset + 'px';
		el.style.left = isIPad ? startX + 208 - Math.round(el.offsetWidth/2) + 'px' : startX + 'px';

		switch (options.animationIn) {
			case 'drop':
				if (isIPad) {
					duration = '0.6s';
					el.style.webkitTransform = 'translate3d(0,' + -(window.scrollY + options.bottomOffset + el.offsetHeight) + 'px,0)';
				} else {
					duration = '0.9s';
					el.style.webkitTransform = 'translate3d(0,' + -(startY + options.bottomOffset) + 'px,0)';
				}
				break;
			case 'bubble':
				if (isIPad) {
					duration = '0.6s';
					el.style.opacity = '0'
					el.style.webkitTransform = 'translate3d(0,' + (startY + 50) + 'px,0)';
				} else {
					duration = '0.6s';
					el.style.webkitTransform = 'translate3d(0,' + (el.offsetHeight + options.bottomOffset + 50) + 'px,0)';
				}
				break;
			default:
				duration = '1s';
				el.style.opacity = '0';
		}

		setTimeout(function () {
			el.style.webkitTransitionDuration = duration;
			el.style.opacity = '1';
			el.style.webkitTransform = 'translate3d(0,0,0)';
			el.addEventListener('webkitTransitionEnd', transitionEnd, false);
		}, 0);

		closeTimeout = setTimeout(addToHomeClose, options.lifespan);
	}, options.startDelay);
}

function transitionEnd () {
	el.removeEventListener('webkitTransitionEnd', transitionEnd, false);
	el.style.webkitTransitionProperty = '-webkit-transform';
	el.style.webkitTransitionDuration = '0.2s';

	if (closeTimeout) {		// Standard loop
		clearInterval(theInterval);
		theInterval = setInterval(setPosition, options.iterations);
	} else {				// We are closing
		el.parentNode.removeChild(el);
	}
}

function setPosition () {
	var matrix = new WebKitCSSMatrix(window.getComputedStyle(el, null).webkitTransform),
		posY = isIPad ? window.scrollY - startY : window.scrollY + window.innerHeight - startY,
		posX = isIPad ? window.scrollX - startX : window.scrollX + Math.round((window.innerWidth - el.offsetWidth)/2) - startX;

	if (posY == matrix.m42 && posX == matrix.m41) return;

	clearInterval(theInterval);
	el.removeEventListener('webkitTransitionEnd', transitionEnd, false);
//	el.style.webkitTransitionDuration = '0';

	setTimeout(function () {
		el.addEventListener('webkitTransitionEnd', transitionEnd, false);
//		el.style.webkitTransitionDuration = '0.2s';
		el.style.webkitTransform = 'translate3d(' + posX + 'px,' + posY + 'px,0)';
	}, 0);
}

function addToHomeClose () {
	clearInterval(theInterval);
	clearTimeout(closeTimeout);
	closeTimeout = null;
	el.removeEventListener('webkitTransitionEnd', transitionEnd, false);
	
	var posY = isIPad ? window.scrollY - startY : window.scrollY + window.innerHeight - startY,
		posX = isIPad ? window.scrollX - startX : window.scrollX + Math.round((window.innerWidth - el.offsetWidth)/2) - startX,
		opacity = '1',
		duration = '0',
		close = el.querySelector('.close');

	if (close) close.removeEventListener('click', addToHomeClose, false);

	el.style.webkitTransitionProperty = '-webkit-transform,opacity';

	switch (options.animationOut) {
		case 'drop':
			if (isIPad) {
				duration = '0.4s';
				opacity = '0';
				posY = posY + 50;
			} else {
				duration = '0.6s';
				posY = posY + el.offsetHeight + options.bottomOffset + 50;
			}
			break;
		case 'bubble':
			if (isIPad) {
				duration = '0.8s';
				posY = posY - el.offsetHeight - options.bottomOffset - 50;
			} else {
				duration = '0.4s';
				opacity = '0';
				posY = posY - 50;
			}
			break;
		default:
			duration = '0.8s';
			opacity = '0';
	}

	el.addEventListener('webkitTransitionEnd', transitionEnd, false);
	el.style.opacity = opacity;
	el.style.webkitTransitionDuration = duration;
	el.style.webkitTransform = 'translate3d(' + posX + 'px,' + posY + 'px,0)';
}

//console.warn(hasHomescreen,!expired,!isStandalone,isSafari)
/* Bootstrap */
if (hasHomescreen && !expired && !isStandalone && isSafari) {
  
  /* Public function */
  return {
    "close":addToHomeClose,
    "ready":ready,
    "loaded":loaded,
    "needed":true
  };
  /*
	document.addEventListener('DOMContentLoaded', ready, false);
	window.addEventListener('load', loaded, false);
	*/
} else {
  return {
    "needed":false
  }
}




}
)();
 };

Joshfire.definedModules['src/app.ios'] = function() { return (
function(App, Class, _, JoshmeAPI,addToHome) {
  return Class(App, {

    id: 'myTED',


    fullscreenCheck:function() {
      if (!addToHome.needed) return;
      
      Joshfire.onReady(function() {
        
        addToHome.ready();
        
        //TODO catch load / already loaded
        addToHome.loaded();
      });
    },
    
    setup: function(callback) {
      var self = this;
      
      self.fullscreenCheck();

      this.__super(function() {

        var likeButton = self.ui.element('/main/home/videodetail/like');
        
        likeButton.subscribe('input', function(ev, id) {

          $('#' + likeButton.htmlId).toggleClass('liked');

          if (!self.userSession){
            //Should be connected. Prompt ?
            return false;
          }

          var favorites = _.extend([], self.userSession.mytv.favorites),
              videoid = '' + self.ui.element('/main/home/videodetail').dataPath.match(/[0-9]+$/)[0];

          if (_.include(favorites, videoid)) {
            //unfavorite
            favorites = _.without(favorites, videoid);
          } else{
            //favorite
            favorites.push(videoid);
          }

          JoshmeAPI.setData(self, self.userSession.uid, {favorites: favorites}, function (err, retour) {
            self.userSession.mytv.favorites = favorites;

            //Update my favs
              self.data.update('/talks/favorites/', 
              _.select(self.data.get('/talks/all/'), 
                function (item){
                  return _.contains(self.userSession.mytv.favorites, item.id);
                }
              )
              );
            
          });
        });

        self.fbInit(callback);
      });
    },

    fbInit: function(callback) {
      var self = this;
      
      //No FB support yet in TEDx mode
      if (TEDXID) return callback();
      
      window.fbAsyncInit = function() {
        FB.init({appId: 214358631942957, status: true, cookie: true, xfbml: true});

        // TODO on iPad this is not fired sometimes.
        FB.getLoginStatus(function(response) {

          var loginButton = self.ui.element('/toolbar/loginButton').htmlEl;

          if (response.session) {
            // logged in and connected user, someone you know
            self.userSession = response.session;
            self.setState('auth', true);
            loginButton.innerHTML = 'Logout';
            loginButton.onclick = self.fbLogout;

            console.warn('self.userSession', self.userSession);

            /* Get myTV data */
            JoshmeAPI.getData(self, self.userSession.uid, function (err, data) {
              console.warn("getData(self …", err, data);
              if (!err && data) {
                self.userSession.mytv = data;
              } else {
                self.userSession.mytv = {'favorites': []};
              }
              
              
              //some more info
              FB.api('/me', function(me){
                self.userSession.name = me.name;
                self.data.get('/talks/favorites').label = me.name+"'s favorites";
              });
            });
          } else {
            // no user session available, someone you dont know
            self.setState('auth', false);
            loginButton.innerHTML = '<a href="http://www.facebook.com/dialog/oauth?client_id=214358631942957&redirect_uri=' + window.location + '&display=touch&scope=read_stream,publish_stream,offline_access">Login</a>';
          }
        });
      };

      var e = document.createElement('script');
      e.async = true;
      e.src = 'http://connect.facebook.net/en_US/all.js'; // + (Joshfire.debug?'//static.ak.fbcdn.net/connect/en_US/core.debug.js':'//connect.facebook.net/en_US/all.js');
      document.getElementById('fb-root').appendChild(e);

      callback();
    },

    fbLogin:function() {
      var self = this;
      
      if (!FB) return;
      FB.login(function(response) {
        if (response.session) {
          if (response.perms) {
            
            // user is logged in and granted some permissions.
            // perms is a comma separated list of granted permissions
            self.userSession = response.session;
            self.setState("auth",true);
          } else {
            // user is logged in, but did not grant any permissions
          }
        } else {
          // user is not logged in
        }
      }, {perms:'read_stream,publish_stream,offline_access'});
    },
    fbLogout: function() {
      FB.logout(function() {
        window.location = window.location;
      });
    }
  });
}
)(Joshfire.loadModule('src/app'),Joshfire.loadModule('joshfire/class'),Joshfire.loadModule('joshfire/vendor/underscore'),Joshfire.loadModule('src/api/joshfire.me'),Joshfire.loadModule('src/vendor/add2home'));
 };

Joshfire.definedModules['joshfire/uielements/video'] = function() { return (
function(UIElement, Class) {
  /**
  * A video, with basic interactions : play, pause, ..
  * @class Video base class
  * @name uielements_video
  * @augments uielement
  */
  return Class(UIElement,
      /**
      * @lends uielements_video.prototype
      */
      {
        type: 'Video',
        // set to false if you need a video element that will not receive the multimedia events (in the case of multiple videos in the same app)
        isDefaultPlayer: true,
        /**
        * @ignore
        *
        */
        init: function() {},

        /**
        * Play a video
        * @function
        * @param {Object} options Options hash.
        *
        */
        play: function(options) {
          if (!options || !options.url) {
            //good things come to those who wait.. No video yet
            return;
          }
          var self = this;
          if (typeof options.url == 'function') {
            options.url(function(error, url) {
              if (error) {
                return self.error(4);
              }
              options.url = url;
              self.playWithStaticUrl(options);
            });
          } else {
            return self.playWithStaticUrl(options);
          }
        },

        /**
        * Play prev video
        * @function
        *
        */
        playPrev: function() {},

        /**
        * Play next video
        * @function
        *
        */
        playNext: function() {
          var that = this;

          var playlistNextMoves = that.app.tree.getData(that.treeCurrent).playlistNext || ['next'];

          // console.log('playlistNextMoves', that.treeCurrent, that.app.tree.getData(that.treeCurrent).playlistNext, JSON.stringify(playlistNextMoves));
          that.app.tree.resolveMoves(that.treeCurrent, playlistNextMoves, false, function(newPath) {
            // console.log('new path', newPath);
            that.app.tree.moveTo('focus', newPath);
            that.app.publish('input', ['enter']);
          });
        },

        /**
        * Pause the video
        * @function
        */
        pause: function() {
          return;
        },

        /**
        * @function refresh
        *
        */
        refresh: function() {},

        /**
        * @function
        *
        */
        getHtml: function() {
          return '';
        }
      });
}
)(Joshfire.loadModule('joshfire/adapters/ios/uielement'),Joshfire.loadModule('joshfire/class'));
 };

Joshfire.definedModules['joshfire/vendor/mediaelement'] = function() { return (
function () {
/*!
* MediaElement.js
* HTML5 <video> and <audio> shim and player
* http://mediaelementjs.com/
*
* Creates a JavaScript object that mimics HTML5 MediaElement API
* for browsers that don't understand HTML5 or can't play the provided codec
* Can play MP4 (H.264), Ogg, WebM, FLV, WMV, WMA, ACC, and MP3
*
* Copyright 2010, John Dyer (http://johndyer.me)
* Dual licensed under the MIT or GPL Version 2 licenses.
*
*/
// Namespace
var mejs = mejs || {};

// version number
mejs.version = '2.1.2';

// player number (for missing, same id attr)
mejs.meIndex = 0;

// media types accepted by plugins
mejs.plugins = {
	silverlight: [
		{version: [3,0], types: ['video/mp4','video/m4v','video/mov','video/wmv','audio/wma','audio/m4a','audio/mp3','audio/wav','audio/mpeg']}
	],
	flash: [
		{version: [9,0,124], types: ['video/mp4','video/m4v','video/mov','video/flv','video/x-flv','audio/flv','audio/x-flv','audio/mp3','audio/m4a','audio/mpeg']}
		//,{version: [11,0], types: ['video/webm']} // for future reference
	]
};

/*
Utility methods
*/
mejs.Utility = {
	encodeUrl: function(url) {
		return encodeURIComponent(url); //.replace(/\?/gi,'%3F').replace(/=/gi,'%3D').replace(/&/gi,'%26');
	},
	escapeHTML: function(s) {
		return s.split('&').join('&amp;').split('<').join('&lt;').split('"').join('&quot;');
	},
	absolutizeUrl: function(url) {
		var el = document.createElement('div');
		el.innerHTML = '<a href="' + this.escapeHTML(url) + '">x</a>';
		return el.firstChild.href;
	},
	getScriptPath: function(scriptNames) {
		var
			i = 0,
			j,
			path = '',
			name = '',
			script,
			scripts = document.getElementsByTagName('script');

		for (; i < scripts.length; i++) {
			script = scripts[i].src;
			for (j = 0; j < scriptNames.length; j++) {
				name = scriptNames[j];
				if (script.indexOf(name) > -1) {
					path = script.substring(0, script.indexOf(name));
					break;
				}
			}
			if (path !== '') {
				break;
			}
		}
		return path;
	},
	secondsToTimeCode: function(seconds) {
		seconds = Math.round(seconds);
		var minutes = Math.floor(seconds / 60);
		minutes = (minutes >= 10) ? minutes : "0" + minutes;
		seconds = Math.floor(seconds % 60);
		seconds = (seconds >= 10) ? seconds : "0" + seconds;
		return minutes + ":" + seconds;
	}
};


// Core detector, plugins are added below
mejs.PluginDetector = {

	// main public function to test a plug version number PluginDetector.hasPluginVersion('flash',[9,0,125]);
	hasPluginVersion: function(plugin, v) {
		var pv = this.plugins[plugin];
		v[1] = v[1] || 0;
		v[2] = v[2] || 0;
		return (pv[0] > v[0] || (pv[0] == v[0] && pv[1] > v[1]) || (pv[0] == v[0] && pv[1] == v[1] && pv[2] >= v[2])) ? true : false;
	},

	// cached values
	nav: window.navigator,
	ua: window.navigator.userAgent.toLowerCase(),

	// stored version numbers
	plugins: [],

	// runs detectPlugin() and stores the version number
	addPlugin: function(p, pluginName, mimeType, activeX, axDetect) {
		this.plugins[p] = this.detectPlugin(pluginName, mimeType, activeX, axDetect);
	},

	// get the version number from the mimetype (all but IE) or ActiveX (IE)
	detectPlugin: function(pluginName, mimeType, activeX, axDetect) {

		var version = [0,0,0],
			description,
			i,
			ax;

		// Firefox, Webkit, Opera
		if (typeof(this.nav.plugins) != 'undefined' && typeof this.nav.plugins[pluginName] == 'object') {
			description = this.nav.plugins[pluginName].description;
			if (description && !(typeof this.nav.mimeTypes != 'undefined' && this.nav.mimeTypes[mimeType] && !this.nav.mimeTypes[mimeType].enabledPlugin)) {
				version = description.replace(pluginName, '').replace(/^\s+/,'').replace(/\sr/gi,'.').split('.');
				for (i=0; i<version.length; i++) {
					version[i] = parseInt(version[i].match(/\d+/), 10);
				}
			}
		// Internet Explorer / ActiveX
		} else if (typeof(window.ActiveXObject) != 'undefined') {
			try {
				ax = new ActiveXObject(activeX);
				if (ax) {
					version = axDetect(ax);
				}
			}
			catch (e) { }
		}
		return version;
	}
};

// Add Flash detection
mejs.PluginDetector.addPlugin('flash','Shockwave Flash','application/x-shockwave-flash','ShockwaveFlash.ShockwaveFlash', function(ax) {
	// adapted from SWFObject
	var version = [],
		d = ax.GetVariable("$version");
	if (d) {
		d = d.split(" ")[1].split(",");
		version = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
	}
	return version;
});

// Add Silverlight detection
mejs.PluginDetector.addPlugin('silverlight','Silverlight Plug-In','application/x-silverlight-2','AgControl.AgControl', function (ax) {
	// Silverlight cannot report its version number to IE
	// but it does have a isVersionSupported function, so we have to loop through it to get a version number.
	// adapted from http://www.silverlightversion.com/
	var v = [0,0,0,0],
		loopMatch = function(ax, v, i, n) {
			while(ax.isVersionSupported(v[0]+ "."+ v[1] + "." + v[2] + "." + v[3])){
				v[i]+=n;
			}
			v[i] -= n;
		};
	loopMatch(ax, v, 0, 1);
	loopMatch(ax, v, 1, 1);
	loopMatch(ax, v, 2, 10000); // the third place in the version number is usually 5 digits (4.0.xxxxx)
	loopMatch(ax, v, 2, 1000);
	loopMatch(ax, v, 2, 100);
	loopMatch(ax, v, 2, 10);
	loopMatch(ax, v, 2, 1);
	loopMatch(ax, v, 3, 1);

	return v;
});
// add adobe acrobat
/*
PluginDetector.addPlugin('acrobat','Adobe Acrobat','application/pdf','AcroPDF.PDF', function (ax) {
	var version = [],
		d = ax.GetVersions().split(',')[0].split('=')[1].split('.');

	if (d) {
		version = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
	}
	return version;
});
*/

// special case for Android which sadly doesn't implement the canPlayType function (always returns '')
if (mejs.PluginDetector.ua.match(/android 2\.[12]/) !== null) {
	HTMLMediaElement.canPlayType = function(type) {
		return (type.match(/video\/(mp4|m4v)/gi) !== null) ? 'probably' : '';
	};
}

// necessary detection (fixes for <IE9)
mejs.MediaFeatures = {
	init: function() {
		var
			nav = mejs.PluginDetector.nav,
			ua = mejs.PluginDetector.ua.toLowerCase(),
			i,
			v,
			html5Elements = ['source','track','audio','video'];

		// detect browsers (only the ones that have some kind of quirk we need to work around)
		this.isiPad = (ua.match(/ipad/i) !== null);
		this.isiPhone = (ua.match(/iphone/i) !== null);
		this.isAndroid = (ua.match(/android/i) !== null);
		this.isIE = (nav.appName.toLowerCase().indexOf("microsoft") != -1);
		this.isChrome = (ua.match(/chrome/gi) !== null);

		// create HTML5 media elements for IE before 9, get a <video> element for fullscreen detection
		for (i=0; i<html5Elements.length; i++) {
			v = document.createElement(html5Elements[i]);
		}

		// detect native JavaScript fullscreen (Safari only, Chrome fails)
		this.hasNativeFullScreen = (typeof v.webkitEnterFullScreen !== 'undefined');
		if (this.isChrome) {
			this.hasNativeFullScreen = false;
		}
	}
};
mejs.MediaFeatures.init();


/*
extension methods to <video> or <audio> object to bring it into parity with PluginMediaElement (see below)
*/
mejs.HtmlMediaElement = {
	pluginType: 'native',
	isFullScreen: false,

	setCurrentTime: function (time) {
		this.currentTime = time;
	},

	setMuted: function (muted) {
		this.muted = muted;
	},

	setVolume: function (volume) {
		this.volume = volume;
	},

	// for parity with the plugin versions
	stop: function () {
		this.pause();
	},

	// This can be a url string
	// or an array [{src:'file.mp4',type:'video/mp4'},{src:'file.webm',type:'video/webm'}]
	setSrc: function (url) {
		if (typeof url == 'string') {
			this.src = url;
		} else {
			var i, media;

			for (i=0; i<url.length; i++) {
				media = url[i];
				if (this.canPlayType(media.type)) {
					this.src = media.src;
				}
			}
		}
	},

	setVideoSize: function (width, height) {
		this.width = width;
		this.height = height;
	}
};

/*
Mimics the <video/audio> element by calling Flash's External Interface or Silverlights [ScriptableMember]
*/
mejs.PluginMediaElement = function (pluginid, pluginType, mediaUrl) {
	this.id = pluginid;
	this.pluginType = pluginType;
	this.src = mediaUrl;
	this.events = {};
};

// JavaScript values and ExternalInterface methods that match HTML5 video properties methods
// http://www.adobe.com/livedocs/flash/9.0/ActionScriptLangRefV3/fl/video/FLVPlayback.html
// http://www.whatwg.org/specs/web-apps/current-work/multipage/video.html
mejs.PluginMediaElement.prototype = {

	// special
	pluginElement: null,
	pluginType: '',
	isFullScreen: false,

	// not implemented :(
	playbackRate: -1,
	defaultPlaybackRate: -1,
	seekable: [],
	played: [],

	// HTML5 read-only properties
	paused: true,
	ended: false,
	seeking: false,
	duration: 0,
	error: null,

	// HTML5 get/set properties, but only set (updated by event handlers)
	muted: false,
	volume: 1,
	currentTime: 0,

	// HTML5 methods
	play: function () {
		if (this.pluginApi != null) {
			this.pluginApi.playMedia();
			this.paused = false;
		}
	},
	load: function () {
		if (this.pluginApi != null) {
			this.pluginApi.loadMedia();
			this.paused = false;
		}
	},
	pause: function () {
		if (this.pluginApi != null) {
			this.pluginApi.pauseMedia();
			this.paused = true;
		}
	},
	stop: function () {
		if (this.pluginApi != null) {
			this.pluginApi.stopMedia();
			this.paused = true;
		}
	},
	canPlayType: function(type) {
		var i,
			j,
			pluginInfo,
			pluginVersions = mejs.plugins[this.pluginType];

		for (i=0; i<pluginVersions.length; i++) {
			pluginInfo = pluginVersions[i];

			// test if user has the correct plugin version
			if (mejs.PluginDetector.hasPluginVersion(this.pluginType, pluginInfo.version)) {

				// test for plugin playback types
				for (j=0; j<pluginInfo.types.length; j++) {
					// find plugin that can play the type
					if (type == pluginInfo.types[j]) {
						return true;
					}
				}
			}
		}

		return false;
	},

	// custom methods since not all JavaScript implementations support get/set

	// This can be a url string
	// or an array [{src:'file.mp4',type:'video/mp4'},{src:'file.webm',type:'video/webm'}]
	setSrc: function (url) {
		if (typeof url == 'string') {
			this.pluginApi.setSrc(mejs.Utility.absolutizeUrl(url));
			this.src = mejs.Utility.absolutizeUrl(url);
		} else {
			var i, media;

			for (i=0; i<url.length; i++) {
				media = url[i];
				if (this.canPlayType(media.type)) {
					this.pluginApi.setSrc(mejs.Utility.absolutizeUrl(media.src));
					this.src = mejs.Utility.absolutizeUrl(url);
				}
			}
		}

	},
	setCurrentTime: function (time) {
		if (this.pluginApi != null) {
			this.pluginApi.setCurrentTime(time);
			this.currentTime = time;
		}
	},
	setVolume: function (volume) {
		if (this.pluginApi != null) {
			this.pluginApi.setVolume(volume);
			this.volume = volume;
		}
	},
	setMuted: function (muted) {
		if (this.pluginApi != null) {
			this.pluginApi.setMuted(muted);
			this.muted = muted;
		}
	},

	// additional non-HTML5 methods
	setVideoSize: function (width, height) {
		if ( this.pluginElement.style) {
			this.pluginElement.style.width = width + 'px';
			this.pluginElement.style.height = height + 'px';
		}
		if (this.pluginApi != null) {
			this.pluginApi.setVideoSize(width, height);
		}
	},

	setFullscreen: function (fullscreen) {
		if (this.pluginApi != null) {
			this.pluginApi.setFullscreen(fullscreen);
		}
	},

	// start: fake events
	addEventListener: function (eventName, callback, bubble) {
		this.events[eventName] = this.events[eventName] || [];
		this.events[eventName].push(callback);
	},
	removeEventListener: function (eventName, callback) {
		if (!eventName) { this.events = {}; return true; }
		var callbacks = this.events[eventName];
		if (!callbacks) return true;
		if (!callback) { this.events[eventName] = []; return true; }
		for (i = 0; i < callbacks.length; i++) {
			if (callbacks[i] === callback) {
				this.events[eventName].splice(i, 1);
				return true;
			}
		}
		return false;
	},	
	dispatchEvent: function (eventName) {
		var i,
			args,
			callbacks = this.events[eventName];

		if (callbacks) {
			args = Array.prototype.slice.call(arguments, 1);
			for (i = 0; i < callbacks.length; i++) {
				callbacks[i].apply(null, args);
			}
		}
	}
	// end: fake events
};


// Handles calls from Flash/Silverlight and reports them as native <video/audio> events and properties
mejs.MediaPluginBridge = {

	pluginMediaElements:{},
	htmlMediaElements:{},

	registerPluginElement: function (id, pluginMediaElement, htmlMediaElement) {
		this.pluginMediaElements[id] = pluginMediaElement;
		this.htmlMediaElements[id] = htmlMediaElement;
	},

	// when Flash/Silverlight is ready, it calls out to this method
	initPlugin: function (id) {

		var pluginMediaElement = this.pluginMediaElements[id],
			htmlMediaElement = this.htmlMediaElements[id];

		// find the javascript bridge
		switch (pluginMediaElement.pluginType) {
			case "flash":
				pluginMediaElement.pluginElement = pluginMediaElement.pluginApi = document.getElementById(id);
				break;
			case "silverlight":
				pluginMediaElement.pluginElement = document.getElementById(pluginMediaElement.id);
				pluginMediaElement.pluginApi = pluginMediaElement.pluginElement.Content.MediaElementJS;
				break;
		}

		if (pluginMediaElement.pluginApi != null && pluginMediaElement.success) {
			pluginMediaElement.success(pluginMediaElement, htmlMediaElement);
		}
	},

	// receives events from Flash/Silverlight and sends them out as HTML5 media events
	// http://www.whatwg.org/specs/web-apps/current-work/multipage/video.html
	fireEvent: function (id, eventName, values) {

		var
			e,
			i,
			bufferedTime,
			pluginMediaElement = this.pluginMediaElements[id];

		pluginMediaElement.ended = false;
		pluginMediaElement.paused = true;

		// fake event object to mimic real HTML media event.
		e = {
			type: eventName,
			target: pluginMediaElement
		};

		// attach all values to element and event object
		for (i in values) {
			pluginMediaElement[i] = values[i];
			e[i] = values[i];
		}

		// fake the newer W3C buffered TimeRange (loaded and total have been removed)
		bufferedTime = values.bufferedTime || 0;

		e.target.buffered = e.buffered = {
			start: function(index) {
				return 0;
			},
			end: function (index) {
				return bufferedTime;
			},
			length: 1
		};

		pluginMediaElement.dispatchEvent(e.type, e);
	}
};

/*
Default options
*/
mejs.MediaElementDefaults = {
	// allows testing on HTML5, flash, silverlight
	// auto: attempts to detect what the browser can do
	// native: forces HTML5 playback
	// shim: disallows HTML5, will attempt either Flash or Silverlight
	// none: forces fallback view
	mode: 'auto',
	// remove or reorder to change plugin priority and availability
	plugins: ['flash','silverlight'],
	// shows debug errors on screen
	enablePluginDebug: false,
	// overrides the type specified, useful for dynamic instantiation
	type: '',
	// path to Flash and Silverlight plugins
	pluginPath: mejs.Utility.getScriptPath(['mediaelement.js','mediaelement.min.js','mediaelement-and-player.js','mediaelement-and-player.min.js']),
	// name of flash file
	flashName: 'flashmediaelement.swf',
	// turns on the smoothing filter in Flash
	enablePluginSmoothing: false,
	// name of silverlight file
	silverlightName: 'silverlightmediaelement.xap',
	// default if the <video width> is not specified
	defaultVideoWidth: 480,
	// default if the <video height> is not specified
	defaultVideoHeight: 270,
	// overrides <video width>
	pluginWidth: -1,
	// overrides <video height>
	pluginHeight: -1,
	// rate in milliseconds for Flash and Silverlight to fire the timeupdate event
	// larger number is less accurate, but less strain on plugin->JavaScript bridge
	timerRate: 250,
	success: function () { },
	error: function () { }
};

/*
Determines if a browser supports the <video> or <audio> element
and returns either the native element or a Flash/Silverlight version that
mimics HTML5 MediaElement
*/
mejs.MediaElement = function (el, o) {
	return mejs.HtmlMediaElementShim.create(el,o);
};

mejs.HtmlMediaElementShim = {

	create: function(el, o) {
		var
			options = mejs.MediaElementDefaults,
			htmlMediaElement = (typeof(el) == 'string') ? document.getElementById(el) : el,
			isVideo = (htmlMediaElement.tagName.toLowerCase() == 'video'),
			supportsMediaTag = (typeof(htmlMediaElement.canPlayType) != 'undefined'),
			playback = {method:'', url:''},
			poster = htmlMediaElement.getAttribute('poster'),
			autoplay =  htmlMediaElement.getAttribute('autoplay'),
			preload =  htmlMediaElement.getAttribute('preload'),
			controls =  htmlMediaElement.getAttribute('controls'),
			prop;

		// extend options
		for (prop in o) {
			options[prop] = o[prop];
		}

		// check for real poster
		poster = (typeof poster == 'undefined' || poster === null) ? '' : poster;
		preload = (typeof preload == 'undefined' || preload === null || preload === 'false') ? 'none' : preload;
		autoplay = !(typeof autoplay == 'undefined' || autoplay === null || autoplay === 'false');
		controls = !(typeof controls == 'undefined' || controls === null || controls === 'false');

		// test for HTML5 and plugin capabilities
		playback = this.determinePlayback(htmlMediaElement, options, isVideo, supportsMediaTag);

		if (playback.method == 'native') {
			// add methods to native HTMLMediaElement
			return this.updateNative( htmlMediaElement, options, autoplay, preload, playback);
		} else if (playback.method !== '') {
			// create plugin to mimic HTMLMediaElement
			return this.createPlugin( htmlMediaElement, options, isVideo, playback.method, (playback.url !== null) ? mejs.Utility.absolutizeUrl(playback.url) : '', poster, autoplay, preload, controls);
		} else {
			// boo, no HTML5, no Flash, no Silverlight.
			this.createErrorMessage( htmlMediaElement, options, (playback.url !== null) ? mejs.Utility.absolutizeUrl(playback.url) : '', poster );
		}
	},

	determinePlayback: function(htmlMediaElement, options, isVideo, supportsMediaTag) {
		var
			mediaFiles = [],
			i,
			j,
			k,
			l,
			n,
			type,
			result = { method: '', url: ''},
			src = htmlMediaElement.getAttribute('src'),
			pluginName,
			pluginVersions,
			pluginInfo;

		// STEP 1: Get URL and type from <video src> or <source src>

		// supplied type overrides all HTML
		if (typeof (options.type) != 'undefined' && options.type !== '') {
			mediaFiles.push({type:options.type, url:null});

		// test for src attribute first
		} else if (src  != 'undefined' && src  !== null) {
			type = this.checkType(src, htmlMediaElement.getAttribute('type'), isVideo);
			mediaFiles.push({type:type, url:src});

		// then test for <source> elements
		} else {
			// test <source> types to see if they are usable
			for (i = 0; i < htmlMediaElement.childNodes.length; i++) {
				n = htmlMediaElement.childNodes[i];
				if (n.nodeType == 1 && n.tagName.toLowerCase() == 'source') {
					src = n.getAttribute('src');
					type = this.checkType(src, n.getAttribute('type'), isVideo);
					mediaFiles.push({type:type, url:src});
				}
			}
		}

		// STEP 2: Test for playback method

		// test for native playback first
		if (supportsMediaTag && (options.mode === 'auto' || options.mode === 'native')) {
			for (i=0; i<mediaFiles.length; i++) {
				// normal check
				if (htmlMediaElement.canPlayType(mediaFiles[i].type).replace(/no/, '') !== '' 
					// special case for Mac/Safari 5.0.3 which answers '' to canPlayType('audio/mp3') but 'maybe' to canPlayType('audio/mpeg')
					|| htmlMediaElement.canPlayType(mediaFiles[i].type.replace(/mp3/,'mpeg')).replace(/no/, '') !== '') {
					result.method = 'native';
					result.url = mediaFiles[i].url;
					return result;
				}
			}
		}

		// if native playback didn't work, then test plugins
		if (options.mode === 'auto' || options.mode === 'shim') {
			for (i=0; i<mediaFiles.length; i++) {
				type = mediaFiles[i].type;

				// test all plugins in order of preference [silverlight, flash]
				for (j=0; j<options.plugins.length; j++) {

					pluginName = options.plugins[j];

					// test version of plugin (for future features)
					pluginVersions = mejs.plugins[pluginName];
					for (k=0; k<pluginVersions.length; k++) {
						pluginInfo = pluginVersions[k];

						// test if user has the correct plugin version
						if (mejs.PluginDetector.hasPluginVersion(pluginName, pluginInfo.version)) {

							// test for plugin playback types
							for (l=0; l<pluginInfo.types.length; l++) {
								// find plugin that can play the type
								if (type == pluginInfo.types[l]) {
									result.method = pluginName;
									result.url = mediaFiles[i].url;
									return result;
								}
							}
						}
					}
				}
			}
		}
		
		// what if there's nothing to play? just grab the first available
		if (result.method === '') {
			result.url = mediaFiles[0].url;
		}

		return result;
	},

	checkType: function(url, type, isVideo) {
		var ext;

		// if no type is supplied, fake it with the extension
		if (url && !type) {
			ext = url.substring(url.lastIndexOf('.') + 1);
			return ((isVideo) ? 'video' : 'audio') + '/' + ext;
		} else {
			// only return the mime part of the type in case the attribute contains the codec
			// see http://www.whatwg.org/specs/web-apps/current-work/multipage/video.html#the-source-element
			// `video/mp4; codecs="avc1.42E01E, mp4a.40.2"` becomes `video/mp4`
			
			if (type && ~type.indexOf(';')) {
				return type.substr(0, type.indexOf(';')); 
			} else {
				return type;
			}
		}
	},

	createErrorMessage: function(htmlMediaElement, options, downloadUrl, poster) {
		var errorContainer = document.createElement('div');
		errorContainer.className = 'me-cannotplay';

		try {
			errorContainer.style.width = htmlMediaElement.width + 'px';
			errorContainer.style.height = htmlMediaElement.height + 'px';
		} catch (e) {}

		errorContainer.innerHTML = (poster !== '') ?
			'<a href="' + downloadUrl + '"><img src="' + poster + '" /></a>' :
			'<a href="' + downloadUrl + '"><span>Download File</span></a>';

		htmlMediaElement.parentNode.insertBefore(errorContainer, htmlMediaElement);
		htmlMediaElement.style.display = 'none';

		options.error(htmlMediaElement);
	},

	createPlugin:function(htmlMediaElement, options, isVideo, pluginType, mediaUrl, poster, autoplay, preload, controls) {
		var width = 1,
			height = 1,
			pluginid = 'me_' + pluginType + '_' + (mejs.meIndex++),
			pluginMediaElement = new mejs.PluginMediaElement(pluginid, pluginType, mediaUrl),
			container = document.createElement('div'),
			specialIEContainer,
			node,
			initVars;

		// check for placement inside a <p> tag (sometimes WYSIWYG editors do this)
		node = htmlMediaElement.parentNode;
		while (node !== null && node.tagName.toLowerCase() != 'body') {
			if (node.parentNode.tagName.toLowerCase() == 'p') {
				node.parentNode.parentNode.insertBefore(node, node.parentNode);
				break;
			}
			node = node.parentNode;
		}

		if (isVideo) {
			width = (options.videoWidth > 0) ? options.videoWidth : (htmlMediaElement.getAttribute('width') !== null) ? htmlMediaElement.getAttribute('width') : options.defaultVideoWidth;
			height = (options.videoHeight > 0) ? options.videoHeight : (htmlMediaElement.getAttribute('height') !== null) ? htmlMediaElement.getAttribute('height') : options.defaultVideoHeight;
		} else {
			if (options.enablePluginDebug) {
				width = 320;
				height = 240;
			}
		}

		// register plugin
		pluginMediaElement.success = options.success;
		mejs.MediaPluginBridge.registerPluginElement(pluginid, pluginMediaElement, htmlMediaElement);

		// add container (must be added to DOM before inserting HTML for IE)
		container.className = 'me-plugin';
		htmlMediaElement.parentNode.insertBefore(container, htmlMediaElement);

		// flash/silverlight vars
		initVars = [
			'id=' + pluginid,
			'isvideo=' + ((isVideo) ? "true" : "false"),
			'autoplay=' + ((autoplay) ? "true" : "false"),
			'preload=' + preload,
			'width=' + width,
			'timerrate=' + options.timerRate,
			'height=' + height];

		if (mediaUrl !== null) {
			if (pluginType == 'flash') {
				initVars.push('file=' + mejs.Utility.encodeUrl(mediaUrl));
			} else {
				initVars.push('file=' + mediaUrl);
			}
		}
		if (options.enablePluginDebug) {
			initVars.push('debug=true');
		}
		if (options.enablePluginSmoothing) {
			initVars.push('smoothing=true');
		}
		if (controls) {
			initVars.push('controls=true'); // shows controls in the plugin if desired
		}

		switch (pluginType) {
			case 'silverlight':
				container.innerHTML =
'<object data="data:application/x-silverlight-2," type="application/x-silverlight-2" id="' + pluginid + '" name="' + pluginid + '" width="' + width + '" height="' + height + '">' +
'<param name="initParams" value="' + initVars.join(',') + '" />' +
'<param name="windowless" value="true" />' +
'<param name="background" value="black" />' +
'<param name="minRuntimeVersion" value="3.0.0.0" />' +
'<param name="autoUpgrade" value="true" />' +
'<param name="source" value="' + options.pluginPath + options.silverlightName + '" />' +
'</object>';
					break;

			case 'flash':

				if (mejs.MediaFeatures.isIE) {
					specialIEContainer = document.createElement('div');
					container.appendChild(specialIEContainer);
					specialIEContainer.outerHTML =
'<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" ' +
'id="' + pluginid + '" width="' + width + '" height="' + height + '">' +
'<param name="movie" value="' + options.pluginPath + options.flashName + '?x=' + (new Date()) + '" />' +
'<param name="flashvars" value="' + initVars.join('&amp;') + '" />' +
'<param name="quality" value="high" />' +
'<param name="bgcolor" value="#000000" />' +
'<param name="wmode" value="transparent" />' +
'<param name="allowScriptAccess" value="always" />' +
'<param name="allowFullScreen" value="true" />' +
'</object>';

				} else {

					container.innerHTML =
'<embed id="' + pluginid + '" name="' + pluginid + '" ' +
'play="true" ' +
'loop="false" ' +
'quality="high" ' +
'bgcolor="#000000" ' +
'wmode="transparent" ' +
'allowScriptAccess="always" ' +
'allowFullScreen="true" ' +
'type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" ' +
'src="' + options.pluginPath + options.flashName + '" ' +
'flashvars="' + initVars.join('&') + '" ' +
'width="' + width + '" ' +
'height="' + height + '"></embed>';
				}
				break;
		}
		// hide original element
		htmlMediaElement.style.display = 'none';

		// FYI: options.success will be fired by the MediaPluginBridge
		
		return pluginMediaElement;
	},

	updateNative: function(htmlMediaElement, options, autoplay, preload, playback) {
		// add methods to video object to bring it into parity with Flash Object
		for (var m in mejs.HtmlMediaElement) {
			htmlMediaElement[m] = mejs.HtmlMediaElement[m];
		}

		
		if (mejs.MediaFeatures.isChrome) {
		
			// special case to enforce preload attribute (Chrome doesn't respect this)
			if (preload === 'none' && !autoplay) {
			
				// forces the browser to stop loading (note: fails in IE9)
				htmlMediaElement.src = '';
				htmlMediaElement.load();
				htmlMediaElement.canceledPreload = true;

				htmlMediaElement.addEventListener('play',function() {
					if (htmlMediaElement.canceledPreload) {
						htmlMediaElement.src = playback.url;
						htmlMediaElement.load();
						htmlMediaElement.play();
						htmlMediaElement.canceledPreload = false;
					}
				}, false);
			// for some reason Chrome forgets how to autoplay sometimes.
			} else if (autoplay) {
				htmlMediaElement.load();
				htmlMediaElement.play();
			}
		}

		// fire success code
		options.success(htmlMediaElement, htmlMediaElement);
		
		return htmlMediaElement;
	}
};

window.mejs = mejs;
window.MediaElement = mejs.MediaElement;

return mejs;

}
)();
 };

Joshfire.definedModules['joshfire/adapters/ios/uielements/video.mediaelement'] = function() { return (
function(Video, Class, $, _, mejs) {


  /**
  * @class Video component on iOS
  * @name adapters_ios_uielements_video.medialement
  * @augments uielements_video
  */
  return Class(Video, {
    /**
    * @lends adapters_ios_uielements_video.medialement.prototype
    */
    /**
    * init
    * @function
    *
    */
    init: function() {

      // Event listeners
      this.listeners = {};

      // Should have an HTML5 <video>-like API
      this.player = false;

      // Status of the video
      this.videoStatus = false;

      // Current video duration
      this.videoDuration = 0;

      var self = this;
      this.app.subscribe('input', function(ev, data) {
        if (self.isDefaultPlayer) {
          self.handleInputEvent(data);
        }
      });


      this.subscribe('input', function(ev, data) {
        self.handleInputEvent(data);
      });

      // Memory leak fixes
      $(window).bind('unload', function() {
        try {
          self.remove();
        } catch (e) {}
      });

      //console.log('jquery/video.mediaelement init');
      this.__super();

    },

    /**
    * @function
    * @param {Array} data
    */
    handleInputEvent: function(data) {
      //      console.log('handleInputEvent', JSON.stringify(data));
      if (data[0] == 'play') {
        this.resume();
      } else if (data[0] == 'stop') {
        this.stop();
      } else if (data[0] == 'pause') {
        this.pause();
      } else if (data[0] == 'next') {
        this.playNext();
      } else if (data[0] == 'prev') {
        this.playPrev();
      } else if (data[0] == 'seekTo') {
        this.setCurrentTime(data[1]);
      } else if (data[0] == 'seekBy') {
        this.setCurrentTime(this.getCurrentTime() + data[1]);
      }
    },

    /**
    * @function
    * @param {Object} ev
    */
    error: function(ev) {

      this.errorCode = this.errorCode != 0 ? this.errorCode : ev.srcElement.error.code;
      var errorMessages = this.options.errorMessages || {};

      switch (this.errorCode) {
        case 1:
          //MEDIA_ERR_ABORTED
          this.message = '<span>' + (errorMessages.aborted || 'The loading of the video was aborted') + '</span>';
          break;
        case 2:
          //MEDIA_ERR_NETWORK:
          this.message = '<span>' + (errorMessages.network || 'A network problem is preventing the video from loading') + '</span>';

          break;
        case 3:
          //MEDIA_ERR_DECODE
          this.message = '<span>' + (errorMessages.decode || 'The video format is not recognized') + '</span>';
          break;
        case 4:
          //MEDIA_ERR_SRC_NOT_SUPPORTED
          //TODO check this error message
          this.message = '<span>' + (errorMessages.notsupported || "The video couldn't be loaded because of a server issue") + '</span>';
          break;
        default:
          this.message = '<span>' + (errorMessages.other || 'Unknown error') + '</span>';
          break;
      }
      this.publish('error', { message: this.message, number: this.errorCode, origin: 'adapters/browser/uielements/video.mediaelement' });
    },

    /**
    * @function
    * @param {Object} target
    * @param {string} eventName
    * @param {Function} listener
    */
    startListening: function(target, eventName, listener) {
      this.listeners[eventName] = listener;
      target.addEventListener(eventName, listener);
    },

    /**
    * @function
    * @param {Object} target
    */
    stopListeningAll: function(target) {

      _.each(this.listeners, function(i, o) {
        try {
          target.removeEventListener(i, o);
        } catch (e) {}
      });
    },

    /**
    * @ignore
    * @function refresh
    *
    */
    refresh: function() {

    },

    /**
    * @function
    * @param {String} status
    */
    setVideoStatus: function(status) {
      this.videoStatus = status;
      this.publish(status);
    },

    /**
    * Play video
    * @function
    * @param {Object} options Hash of options.
    * @param {String} options.url URL of the video.
    * @param {String} options.mime mime type.
    * @param {String} options.image thumbnail.
    * @param {Function} options.cleanup cleaning function.
    * @param {bool} options.forceAspectRatio adapt player to video stream or fixed size ?
    * @param {int} options.width If forceAspectRatio.
    * @param {bool} options.noAutoPlay
    */
    playWithStaticUrl: function(options) {
      var self = this,
          controls = (self.options.controls) ? ' controls' : '';

      // Insertion
      $('#' + self.htmlId)[0].innerHTML = '<span class="close">Close</span><video id="' + self.htmlId + '_video" src="' + options.url + '" ' + (options.noautoplay ? '' : 'autoplay="true"') + ' autobuffer preload ' + (options.image ? 'poster="' + options.image + '"' : '') + controls + ' />';
      self.player = document.getElementById(self.htmlId + '_video');

      if (self.player.paused) {
        $('#' + self.player.id).addClass('video-paused');
      }

      // If controls are not displayed, use touch event to play/pause
      if (!controls) {
        var events;

        try {
          document.createEvent('TouchEvent');
          events = 'touchstart MozTouchDown';
        } catch (e) {
          events = 'mousedown';
        }

        $('#' + self.htmlId + ' .close').bind(events, function(e) {
          $('#' + self.htmlId).html('').hide();
        });

        $('#' + self.htmlId + '_video').bind(events, function(e) {
          $('#' + self.player.id).toggleClass('video-paused');
          if (self.player.paused) {
            self.player.play();
          }
          else {
            self.player.pause();
          }
        });
      }



      self.setVideoStatus('loading');
    },

    /**
    * pause a video
    * @function
    *
    */
    pause: function() {
      this.setVideoStatus('paused');
      if (this.player) {
        this.player.pause();
      }
    },

    /**
    * resume a video
    * @function
    *
    */
    resume: function() {
      this.setVideoStatus('playing');
      if (this.player) {
        this.player.play();
      }

    },

    /**
    * stop a video
    * @function
    *
    */
    stop: function() {
      this.setVideoStatus('stopped');
      if (this.player) {
        this.player.pause();
      }

    },

    /**
    * get current time
    * @function
    * @return {int}
    */
    getCurrentTime: function() {
      if (this.player) return this.player.currentTime;
      return 0;
    },

    /**
    * get video duration
    * @function
    * @return {int}
    */
    getTotalTime: function() {
      return this.videoDuration;
    },

    /**
    * @function
    * @param {int} seconds
    */
    setCurrentTime: function(seconds) {
      if (this.player) this.player.setCurrentTime(Math.max(0, seconds));
    },

    /**
    * @function
    *
    */
    remove: function() {
      this.playingPath = false;
      //if (typeof this.player != 'undefined')
      if (this.player) {
        try {
          //          console.log('remove workflow: stopAll', this.id);
          this.stopListeningAll(this.player);
        } catch (e0) {}

        try {
          //          console.log('remove workflow: pause', this.id);
          this.player.pause();

        } catch (e1) {}

        try {
          //console.log('remove workflow: stop', this.id);
          this.player.stop();
        } catch (e2) {}

        try {
          //console.log('remove workflow: stopped', this.id);
          this.setVideoStatus('stopped');
        } catch (e3) {}

        try {
          //console.log('remove workflow: src', this.id);
          //this.player.src ='/images/mediaelement/empty.mp4'; // setSrc('/images/mediaelement/empty.mp4'); //data:image/gif;base64,R0lGODlhAQABAJH/AP///wAAAP///wAAACH/C0FET0JFOklSMS4wAt7tACH5BAEAAAIALAAAAAABAAEAAAICVAEAOw==');
          this.player.setSrc('/images/mediaelement/spacer.gif');
          //console.log('remove workflow: load', this.id);
          this.player.load();
        } catch (e4) {}

        try {
          //console.log('remove workflow: restop', this.id);
          this.player.stop();
        } catch (e5) {}

        try {
          //console.log('remove workflow: remove', this.id);
          $(this.player).remove();
        } catch (e6) {}

        try {
          //console.log('remove workflow: delete', this.id);
          delete this.player;
        } catch (e7) {}


      }

      //console.log("REMOVED VIDEO", this.id);
      //$("#"+this.htmlId).html('');
    },

    /**
    * @function
    * @return {string} html.
    */
    getHtml: function() {
      return "<div class='josh-type-" + this.type + "' id='" + this.htmlId + "'></div>";
    }
  });
}
)(Joshfire.loadModule('joshfire/uielements/video'),Joshfire.loadModule('joshfire/class'),Joshfire.loadModule('joshfire/vendor/zepto'),Joshfire.loadModule('joshfire/vendor/underscore'),Joshfire.loadModule('joshfire/vendor/mediaelement'));
 };

Joshfire.definedModules['joshfire/adapters/ios/uielements/mediacontrols'] = function() { return (
function(UIElement, Class) {


  /**
  * @class Silent media controls on iOS that has a native video player
  * @name adapters_ios_uielements_mediacontrols
  * @augments uielement
  */
  return Class(UIElement,
      /**
      * @lends adapters_android_uielements_list.prototype
      */
      { type: 'MediaControls',
        /**
        * @function init
        *
        */
        init: function() {
        },


        /**
        * @function inner html
        * returns {String} empty
        */
        getInnerHtml: function() {
          return '';
        },
        /**
        * @ignore
        * @function refresh
        *
        */
        refresh: function() {

        },

        /**
        * @ignore
        *@function
        *
        */
        show: function() {

        },
        /**
        * @ignore
        * @function
        *
        */
        hide: function() {

        }


      });


}
)(Joshfire.loadModule('joshfire/adapters/ios/uielement'),Joshfire.loadModule('joshfire/class'));
 };

Joshfire.definedModules['joshfire/adapters/ios/uielements/video.youtube'] = function() { return (
function(Video,Class, $, _) {


  /**
  * @class Video component on iOS for Youtube videos
  * @name adapters_ios_uielements_video.medialement
  * @augments uielements_video
  */
  return Class(Video, {
    /**
    * @lends adapters_ios_uielements_video.medialement.prototype
    */
    /**
    * init
    * @function
    *
    */
    init: function() {

      //console.log('jquery/video.mediaelement init');
      this.__super();

    },

    playWithStaticUrl: function(options) {
      var self = this,
          controls = (self.options.controls) ? ' controls' : '';

      if (self.options.width) {
        var width = self.options.width;
      } else {
        var width = $(this.htmlEl).width();
      }


      //TODO configurable aspect ratio.
      var height = parseInt(width * 9 / 16);

      // Insertion
      this.htmlEl.innerHTML = '<object width=\"' + width + '\" height=\"' + height + '\">' + //
          '<param name=\"movie\" value=\"http://www.youtube.com/v/' + options.url + '&f=gdata_videos\"></param>' +
          '<param name=\"wmode\" value=\"transparent\"></param>' +
          '<embed src=\"http://www.youtube.com/v/' + options.url + '&f=gdata_videos\"' +
          'type=\"application/x-shockwave-flash\" wmode=\"transparent\" width=\"' + width + '\" height=\"' + height + '\"></embed>' + //
          '</object>';

    },

    pause: function() {
      // Can't do that for now.
    },

    stop: function() {
      this.htmlEl.innerHTML = '';
    },

    /**
    * @function
    * @return {string} html.
    */
    getHtml: function() {
      return "<div class='josh-type-" + this.type + "' id='" + this.htmlId + "'></div>";
    }
  });
}
)(Joshfire.loadModule('joshfire/uielements/video'),Joshfire.loadModule('joshfire/class'),Joshfire.loadModule('joshfire/vendor/zepto'),Joshfire.loadModule('joshfire/vendor/underscore'));
 };