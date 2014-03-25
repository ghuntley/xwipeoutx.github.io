(function(global) {
    var localStorage = global.localStorage || {};

    var totalCounts = [];
    var totalPasses = [];
    var hasFailed = false;

    var originalTitle = document.title;
    var favIconTimerId;

    var failedIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHdSURBVDjLpZNraxpBFIb3a0ggISmmNISWXmOboKihxpgUNGWNSpvaS6RpKL3Ry//Mh1wgf6PElaCyzq67O09nVjdVlJbSDy8Lw77PmfecMwZg/I/GDw3DCo8HCkZl/RlgGA0e3Yfv7+DbAfLrW+SXOvLTG+SHV/gPbuMZRnsyIDL/OASziMxkkKkUQTJJsLaGn8/iHz6nd+8mQv87Ahg2H9Th/BxZqxEkEgSrq/iVCvLsDK9awtvfxb2zjD2ARID+lVVlbabTgWYTv1rFL5fBUtHbbeTJCb3EQ3ovCnRC6xAgzJtOE+ztheYIEkqbFaS3vY2zuIj77AmtYYDusPy8/zuvunJkDKXM7tYWTiyGWFjAqeQnAD6+7ueNx/FLpRGAru7mcoj5ebqzszil7DggeF/DX1nBN82rzPqrzbRayIsLhJqMPT2N83Sdy2GApwFqRN7jFPL0tF+10cDd3MTZ2AjNUkGCoyO6y9cRxfQowFUbpufr1ct4ZoHg+Dg067zduTmEbq4yi/UkYidDe+kaTcP4ObJIajksPd/eyx3c+N2rvPbMDPbUFPZSLKzcGjKPrbJaDsu+dQO3msfZzeGY2TCvKGYQhdSYeeJjUt21dIcjXQ7U7Kv599f4j/oF55W4g/2e3b8AAAAASUVORK5CYII=';
    var passedIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKfSURBVDjLpZPrS1NhHMf9O3bOdmwDCWREIYKEUHsVJBI7mg3FvCxL09290jZj2EyLMnJexkgpLbPUanNOberU5taUMnHZUULMvelCtWF0sW/n7MVMEiN64AsPD8/n83uucQDi/id/DBT4Dolypw/qsz0pTMbj/WHpiDgsdSUyUmeiPt2+V7SrIM+bSss8ySGdR4abQQv6lrui6VxsRonrGCS9VEjSQ9E7CtiqdOZ4UuTqnBHO1X7YXl6Daa4yGq7vWO1D40wVDtj4kWQbn94myPGkCDPdSesczE2sCZShwl8CzcwZ6NiUs6n2nYX99T1cnKqA2EKui6+TwphA5k4yqMayopU5mANV3lNQTBdCMVUA9VQh3GuDMHiVcLCS3J4jSLhCGmKCjBEx0xlshjXYhApfMZRP5CyYD+UkG08+xt+4wLVQZA1tzxthm2tEfD3JxARH7QkbD1ZuozaggdZbxK5kAIsf5qGaKMTY2lAU/rH5HW3PLsEwUYy+YCcERmIjJpDcpzb6l7th9KtQ69fi09ePUej9l7cx2DJbD7UrG3r3afQHOyCo+V3QQzE35pvQvnAZukk5zL5qRL59jsKbPzdheXoBZc4saFhBS6AO7V4zqCpiawuptwQG+UAa7Ct3UT0hh9p9EnXT5Vh6t4C22QaUDh6HwnECOmcO7K+6kW49DKqS2DrEZCtfuI+9GrNHg4fMHVSO5kE7nAPVkAxKBxcOzsajpS4Yh4ohUPPWKTUh3PaQEptIOr6BiJjcZXCwktaAGfrRIpwblqOV3YKdhfXOIvBLeREWpnd8ynsaSJoyESFphwTtfjN6X1jRO2+FxWtCWksqBApeiFIR9K6fiTpPiigDoadqCEag5YUFKl6Yrciw0VOlhOivv/Ff8wtn0KzlebrUYwAAAABJRU5ErkJggg==';
    var runningPassedIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIMSURBVBgZpcHNi05xGMfhz/07hzTDiKZmEmLYeM3iKTKUiFhY2EhZ2NjIBgsWYoUoSWr+B7NhY6GkJBRhYSMvJYRSFDPPi3N+9/01Z2Jvcl0mif9h+46PH92yrXXpe0f9EhCBIvBwFCIUyJ2QkDsewcDsuv3y5adTN67sHytbo61rs+b0p6E5zER/u+PXgLGyUyt1vk8yU91aiSmlXJw/uJKZOnzxPY1SChpVdgQohAcEIkJ4BJ6FZ+EKKhfLh+fh4TRKJBqWDJNQMmTCwkjJMEuYOVaIIhJlFo3ITiN5OI0EmBmWjCIZqTAsQZFgVlFw/tZuTt/cjIqaRnjQSAoxzYxGApIZKRlFYRQGKcGvXLF4cBXHxjdS5R4RTqOMcP4yM6ZJnLy+DSlTRabKmUULVrJqeCMTvTZ7x0ZYoKs0ylzXTDPDAEmYGTkqdq45hCvwcALx+cdH1i0eZbLq8qx7iPXnDswv5UGjAMQUM5Do5QpX8P7bG+rI5Kipvebnrwk2LNnKZN3h8bsH38qI4C8DjClm9HKP7JmhgaXkcFzBlx8fWDh3mOcfH/L47Qs6Tsv2HR8fH1qyaH+4Ex64OxHBz8Ej9KqKKip6uWLF4Go2jezi6YdH3H/1hGXdE7fvXD6zxyTxL9aeS+3W0u19917f/VQFOz5f0CummCT+xchZa3sUfd3wka8X9I4/fgON+TR7PCxMcAAAAABJRU5ErkJggg==';
    var runningFailedIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90CBw0qMMQJoV8AAAIRSURBVDjLpZNPSFRRFMZ/575RLMsIJCU0UIwwN0EDVhYYQtjChYskaBH92UQrIYiI2lRSUC0E19FSiKBFELg1ixYt2khUSI4tFSxnnHnvnnNavBnbKl344HI4/M73ce8Rd+d/joxPzt48PVx8slbxVnfADDdDTXFzzA1XxdxxVdSMtuasvLj46/br5xMzheJQcbqppTV0tOxocGu5otPATKGSeaisbezY+mbmAaDg6jy61LdjwPXHP8kBbgCkUXHAzVEDwzFz1AyNnsuNVJ2ezr2oaQ6g/goSBHHHg+DiiAkhCCIBEUUSJ7FAIeb9FnNAaJACICJIEJIghESQAEmApiRhbuwCb8+O4kmWAzR3Htzq/0BkCxQkn54kQiIQAsQ0pb3/MG9OjhCrNawRoXGh7gAAd14Nj+HRsJgRY8b+vh46B49TLW8w0zuAXp3KATHLthwI4O6ICJZmDFy+iJtiquDOemmFrqFB0s0yx57d4OHUlX0Fr2dJAG9EcSemNdyU1W8/sJhhWYZmGbU/v+k+c4qsUmZpfn61YGb/ItSFCLFaRWOk7VAXphE3Y325xJ7OA5Tef+D7l88oWpTxydnZju6DE6aKqaGqmBknXtwiTWtYmhLTGu1H++k9N8LywgJfPy3w8drku7mn987j7tvSA9lVfjky6ncprNwhHGnUZbvrfF+ay5bIbtO0d8p9qVH/C58rTkV50AKSAAAAAElFTkSuQmCC'

    setFavIconElement(runningPassedIcon);

    var baseTemplate =
        '<div id="basil-header">'
            + '<div id="basil-summary">'
            + '<div>Total:<ul id="basil-totals"></ul></div>'
            + '<div> Pass:<ul id="basil-passes"></ul></div>'
            + '</div>'
            + '<a id="basil-title"></a>'
            + '<form method="get" id="basil-settings">'
            + '<label>Filter <input type="text" id="basil-filter" name="filter"></label>'
            + '<label><input type="checkbox" id="basil-hide-passed" name="hide-passed">Hide Passed</label>'
            + '</form>'
            + '</div>'
            + '<div id="basil-results"></div>';

    delete global.describe;
    delete global.when;
    delete global.then;
    delete global.it;

    var testRunner = new Basil.TestRunner();

    var filterIsFine = false;

    function filteringIntercept (name, fn) {
        if (filterIsFine)
            return testRunner.test(name, fn);

        var filter = param('filter');
        if (filter && name.toLowerCase().indexOf(filter.toLowerCase()) == -1)
            return;

        filterIsFine = true;
        testRunner.test(name, fn);
        filterIsFine = false;
    }

    var interceptor = new Basil.Interceptor(global, filteringIntercept);
    interceptor.intercept('describe');
    interceptor.intercept('when');
    interceptor.intercept('then');
    interceptor.intercept('it');

    testRunner.onRootTestCompleted(onRootComplete);
    interceptor.pause();

    waitForBody();

    function waitForBody () {
        if (!document.body)
            return setTimeout(waitForBody, 10);

        setup();
        interceptor.resume();
    }


    function onRootComplete (test) {
        var resultsElement = document.getElementById('basil-results');
        appendResults(resultsElement, [test], 'basil');
        updateTotals(test);

        if (!test.hasPassed()) {
            hasFailed = true;
            document.getElementById('basil-header').className = 'is-failed';
        }

        updateIconAndTitle();
    }

    function param (key) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == key) {
                var value = pair[1].replace('+', ' ');
                return decodeURIComponent(value);
            }
        }
    }

    function setup () {
        createBaseStructure();
        setTitle();
        setupSettingsForm();
        setupHidePassed();

        function createBaseStructure () {
            var body = document.body;
            createDom(baseTemplate)
                .forEach(body.appendChild.bind(body));
        }

        function setTitle () {
            var pageTitle = document.getElementsByTagName('title');
            var titleText = pageTitle.length ? pageTitle[0].innerText : 'Basil';
            document.getElementById('basil-title').innerText = titleText;
            document.getElementById('basil-title').href = document.location.href.replace(document.location.search, '');
        }

        function setupSettingsForm () {
            document.getElementById('basil-settings').setAttribute('action', document.location.href);

            var filter = document.getElementById('basil-filter');
            filter.setAttribute('value', param('filter') || '');
            filter.focus();
        }

        function setupHidePassed () {
            var checkbox = document.getElementById('basil-hide-passed')
            var results = document.getElementById('basil-results');

            checkbox.checked = localStorage.isHidePassedChecked == 'true';
            updateHidePassedState();

            checkbox.addEventListener('change', updateHidePassedState);

            function updateHidePassedState () {
                localStorage.isHidePassedChecked = checkbox.checked;
                if (checkbox.checked)
                    results.setAttribute('class', 'is-hiding-passed');
                else
                    results.removeAttribute('class');
            }

            ;
        }
    }

    function appendResults (el, tests, parentFullName) {
        if (!tests.length)
            return;

        var ul = document.createElement('ul');
        tests.forEach(function(test, i) {
            var li = createLi(test, parentFullName);
            appendResults(li, test.children(), li.fullName);
            ul.appendChild(li);
        });

        el.appendChild(ul);
    }

    function createLi (test, parentFullName) {
        var fullName = parentFullName + ' ' + test.name();
        var caption = getCaption(test);

        var li = document.createElement('li');
        li.test = test;
        li.fullName = fullName;
        li.setAttribute('class', getCssClass(li));
        li.innerHTML = caption;

        if (test.children().length)
            addExpandCollapse(li, test);

        if (test.inspect) {
            addInspectionLink(li, test);
            addViewCodeLink(li, test);
        }

        return li;
    }

    function addExpandCollapse (li, test, cssClass) {
        li.addEventListener('click', function(event) {
            if (event.target != li)
                return;

            toggleCollapsed(li.fullName);
            li.setAttribute('class', getCssClass(li));
        });
    }

    function isCollapsed (fullName) {
        var key = 'basil-collapsed-' + fullName;
        return !!localStorage[key];
    }

    function toggleCollapsed (fullName) {
        var key = 'basil-collapsed-' + fullName;
        if (localStorage[key])
            delete localStorage[key];
        else
            localStorage[key] = true;

    }

    function addInspectionLink (li, test) {
        var a = document.createElement('a');
        a.innerHTML = " inspect";
        a.setAttribute('class', 'basil-inspect');
        a.setAttribute('href', '#');

        addInspectListener(a, test.inspect.bind(test.inspectThisValue));

        li.appendChild(a);
    }

    function addInspectListener (a, inspect) {
        a.addEventListener('click', function(event) {
            event.preventDefault();
            debugger;
            inspect();
        });
    }

    function addViewCodeLink (li, test) {
        var checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('class', 'toggle-fail-code');

        var code = document.createElement('span');
        code.innerHTML = test.inspect.toString().split("\n").slice(1, -1).join("\n");
        code.setAttribute('class', 'fail-code');

        li.appendChild(checkbox);
        li.appendChild(code);
    }

    function getCssClass (li) {
        var test = li.test;
        var cssClass = test.isComplete()
            ? (test.hasPassed() ? 'is-passed' : 'is-failed')
            : 'is-not-run';

        cssClass += test.children().length ? ' basil-parent' : ' basil-leaf';

        if (isCollapsed(li.fullName))
            cssClass += ' is-collapsed';
        return cssClass;
    }

    function getCaption (test) {
        var error = test.error();
        var errorString = error ? ('(' + error.toString() + ')') : '';
        return test.name() + " " + errorString;
    }

    function updateIconAndTitle () {
        if (favIconTimerId)
            clearTimeout(favIconTimerId);

        document.title = "[" + totalCounts[0] + "] " + originalTitle;

        if (hasFailed)
            setFavIconElement(runningFailedIcon);
        else
            setFavIconElement(runningPassedIcon);

        favIconTimerId = setTimeout(function() {
            if (hasFailed)
                setFavIconElement(failedIcon);
            else
                setFavIconElement(passedIcon);
            favIconTimerId = null;
        }, 10);
    }

    function setFavIconElement (url) {
        var favIcon = document.getElementById('favIcon');
        if (!favIcon) {
            document.head.innerHTML += '<link id="favIcon" rel="shortcut icon" type="image/x-icon"/>';
            favIcon = document.getElementById('favIcon');
        }
        favIcon.href = url;
    }

    function updateTotals (test) {
        calculateTotals([test], 0);

        updateTotalsNode(document.getElementById('basil-totals'), totalCounts);
        updateTotalsNode(document.getElementById('basil-passes'), totalPasses);
    }

    function calculateTotals (tests, level) {
        if (!tests.length)
            return;

        var currentTotalCount = totalCounts[level] || 0;
        totalCounts[level] = currentTotalCount + tests.length;

        var currentPassCount = totalPasses[level] || 0;
        var passingResults = tests.filter(function(test) { return test.hasPassed(); });
        totalPasses[level] = currentPassCount + passingResults.length;

        tests.forEach(function(test) { calculateTotals(test.children(), level + 1);});
    }

    function updateTotalsNode (listNode, totalCounts) {
        totalCounts.forEach(function(totalCount, i) {
            var nextNode = listNode.childNodes[i];
            if (!nextNode) {
                nextNode = document.createElement('li');
                listNode.appendChild(nextNode);
            }
            nextNode.innerHTML = ' ' + ('      ' + totalCount).slice(-5);
        });
    }

    var nursery;

    function createDom (html) {
        if (!nursery)
            nursery = document.createElement('div');

        nursery.innerHTML = html;
        var elements = [];

        while (nursery.children.length)
            elements.push(nursery.removeChild(nursery.children[0]));

        return elements;
    }
})(this);
