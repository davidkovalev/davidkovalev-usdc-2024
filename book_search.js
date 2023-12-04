/** 
 * RECOMMENDATION
 * 
 * To test your code, you should open "tester.html" in a web browser.
 * You can then use the "Developer Tools" to see the JavaScript console.
 * There, you will see the results unit test execution. You are welcome
 * to run the code any way you like, but this is similar to how we will
 * run your code submission.
 * 
 * The Developer Tools in Chrome are available under the "..." menu, 
 * futher hidden under the option "More Tools." In Firefox, they are 
 * under the hamburger (three horizontal lines), also hidden under "More Tools." 
 */

/**
 * Searches for matches in scanned text.
 * @param {string} searchTerm - The word or term we're searching for. 
 * @param {JSON} scannedTextObj - A JSON object representing the scanned text.
 * @returns {JSON} - Search results.
 * */ 
 function findSearchTermInBooks(searchTerm, scannedTextObj) {
    const results = [];

    // Iterate through each book object
    for(var book of scannedTextObj){
        var bookLength = book.Content.length;
        // Search through the book's Content
        for(var contentIndex = 0; contentIndex < bookLength; contentIndex++){
            // Get content and other attributes.
            var contentObj = book.Content[contentIndex];
            var thisPage = contentObj.Page;
            var thisLine = contentObj.Line;
            var thisText = contentObj.Text;

            var searchTermFound = thisText.indexOf(searchTerm);
            
            // Search term not completely found in this line.
            if(searchTermFound < 0){
                // If the last character in the line is a hypen
                // then the search term may be split between
                // 2 different lines.
                if((thisText[thisText.length - 1] == "-")
                    && (contentIndex + 1 < bookLength)){
                    var nextContent = book.Content[contentIndex + 1];
                    var nextPage = nextContent.Page;
                    var nextLine = nextContent.Line;
                    var nextText = nextContent.Text;
                        
                    // Verify that the next line is on the same page
                    // and is actually the next line.
                    if( (thisPage == nextPage)
                        && (thisLine + 1 == nextLine) ){
                        // Remove hyphen from this line.
                        var _thisLine = thisText.slice(0, thisText.length - 1);
                        var conjoined = _conjoinLineWithNextWord(_thisLine, nextText);
                        
                        // Search the line with the hyphenated-word included.
                        searchTermFound = conjoined.indexOf(searchTerm)
                    }
                }
            } // End multi-line search


            // Search term has been found
            if(searchTermFound >= 0){
                // Construct JSON
                const found = {
                    "ISBN": book.ISBN,
                    "Page": thisPage,
                    "Line": thisLine
                };
                // Add object to results array
                results.push(found);
            }
        } // End book content for loop
    } // End book iteration

    // Result JSON
    var result = {
        "SearchTerm": searchTerm,
        "Results": results
    };
    
    return result; 
}



/**
 * Concatenates the first word in nextLine onto thisLine
 * @param {string} thisLine 
 * @param {string} nextLine 
 * @returns {string}
 */
function _conjoinLineWithNextWord(thisLine, nextLine){
    var firstWord = _firstWordOfString(nextLine);
    return thisLine + firstWord;
}



/**
 * Returns the first word of the given string
 * where punctuation or spaces are endings of words.
 * @param {string} s 
 * @returns {string}
 */
function _firstWordOfString(s){
    var punctuation = [".", " ", ";", ",", "!", "?"];
    var wordEnd = s.length;
    
    for(var punctuator of punctuation){
        var firstIndex = s.indexOf(punctuator);
        // Ignore unfound punctuation
        if(firstIndex >= 0){
            wordEnd = _min(wordEnd, firstIndex);
        }
    }

    var firstWord = s.slice(0, wordEnd);

    return firstWord;
}



/**
 * Returns the minimum between the two integers
 * @param {integer} a 
 * @param {integer} b 
 */
function _min(a, b){
    if (a < b){
        return a;
    }
    else{
        return b;
    }
}





/** Example input object. */
const twentyLeaguesIn = [
    {
        "Title": "Twenty Thousand Leagues Under the Sea",
        "ISBN": "9780000528531",
        "Content": [
            {
                "Page": 31,
                "Line": 8,
                "Text": "now simply went on by her own momentum.  The dark-"
            },
            {
                "Page": 31,
                "Line": 9,
                "Text": "ness was then profound; and however good the Canadian\'s"
            },
            {
                "Page": 31,
                "Line": 10,
                "Text": "eyes were, I asked myself how he had managed to see, and"
            } 
        ] 
    }
]
    
/** Example output object */
const twentyLeaguesOut = {
    "SearchTerm": "the",
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 9
        }
    ]
}

/*
 _   _ _   _ ___ _____   _____ _____ ____ _____ ____  
| | | | \ | |_ _|_   _| |_   _| ____/ ___|_   _/ ___| 
| | | |  \| || |  | |     | | |  _| \___ \ | | \___ \ 
| |_| | |\  || |  | |     | | | |___ ___) || |  ___) |
 \___/|_| \_|___| |_|     |_| |_____|____/ |_| |____/ 
                                                      
 */

/* We have provided two unit tests. They're really just `if` statements that 
 * output to the console. We've provided two tests as examples, and 
 * they should pass with a correct implementation of `findSearchTermInBooks`. 
 * 
 * Please add your unit tests below.
 * */

/** We can check that, given a known input, we get a known output. */
const test1result = findSearchTermInBooks("the", twentyLeaguesIn);
if (JSON.stringify(twentyLeaguesOut) === JSON.stringify(test1result)) {
    console.log("PASS: Test 1");
} else {
    console.log("FAIL: Test 1");
    console.log("Expected:", twentyLeaguesOut);
    console.log("Received:", test1result);
}

/** We could choose to check that we get the right number of results. */
const test2result = findSearchTermInBooks("the", twentyLeaguesIn); 
if (test2result.Results.length == 1) {
    console.log("PASS: Test 2");
} else {
    console.log("FAIL: Test 2");
    console.log("Expected:", twentyLeaguesOut.Results.length);
    console.log("Received:", test2result.Results.length);
}




/**
 * Multi-line line word test
 * 
 * Test where word appears with a hyphen, split between 2 lines.
 *
 *  i.e. "darkness" as it appears in:
    * now simply went on by her own momentum.  The dark-
    * ness was then profound; and however good the Canadian\'s
 */
const multiLineWordTest = findSearchTermInBooks("darkness", twentyLeaguesIn);
const multiWordOut = {
    "SearchTerm": "darkness",
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 8
        }
    ]
}

if (JSON.stringify(multiLineWordTest) === JSON.stringify(multiWordOut)) {
    console.log("PASS: Multi-line line word test");
} else {
    console.log("FAIL: Multi-line line word test");
    console.log("Expected:", multiWordOut);
    console.log("Received:", multiLineWordTest);
}


/**
 * Escaped characters test
 * 
 * Test a search term with an escaped character
 * 
 * i.e. "Canadian's" as it appears in:
    * ness was then profound; and however good the Canadian\'s
 */
const escapedCharacterTest = findSearchTermInBooks("Canadian\'s", twentyLeaguesIn);
const escapedCharacterOut = {
    "SearchTerm": "Canadian\'s",
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 9
        }
    ]
}

if (JSON.stringify(escapedCharacterTest) === JSON.stringify(escapedCharacterOut)) {
    console.log("PASS: Escaped characters test");
} else {
    console.log("FAIL: Escaped characters test");
    console.log("Expected:", escapedCharacterOut);
    console.log("Received:", escapedCharacterTest);
}


/**
 * One line per find test
 * 
 * Test a search term that appears multiple times on a line
 * but does not cause duplicate lines in the Results.
 * 
 * i.e. the space character " " should only cause one result per line
 */
const oneLinePerFindTest = findSearchTermInBooks(" ", twentyLeaguesIn);
const oneLinePerFindOut = {
    "SearchTerm": " ",
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 8
        },
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 9
        },
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 10
        }
    ]
}

if (JSON.stringify(oneLinePerFindTest) === JSON.stringify(oneLinePerFindOut)) {
    console.log("PASS: One line per find test");
} else {
    console.log("FAIL: One line per find test");
    console.log("Expected:", oneLinePerFindOut);
    console.log("Received:", oneLinePerFindTest);
}


/**
 * No results test
 * 
 * Test a search term with no occurences in a book
 */
const noResultsTest = findSearchTermInBooks("Javascript", twentyLeaguesIn);
const noResultsOut = {
    "SearchTerm": "Javascript",
    "Results": []
}

if (JSON.stringify(noResultsTest) === JSON.stringify(noResultsOut)) {
    console.log("PASS: No results test");
} else {
    console.log("FAIL: No results test");
    console.log("Expected:", noResultsOut);
    console.log("Received:", noResultsTest);
}



/**
 * Partial word test
 * 
 * Test a search term that partially appears in a book
 */
const partialWordTest = findSearchTermInBooks("moment", twentyLeaguesIn);
const partialWordOut = {
    "SearchTerm": "moment",
    "Results": [
        {
        "ISBN": "9780000528531",
        "Page": 31,
        "Line": 8
        }
    ]
}

if (JSON.stringify(partialWordTest) === JSON.stringify(partialWordOut)) {
    console.log("PASS: Partial word test");
} else {
    console.log("FAIL: Partial word test");
    console.log("Expected:", partialWordOut);
    console.log("Received:", partialWordTest);
}



/**
 * Multiple books test
 * 
 * Test multiple books with a common search term
 */
const manyBooks = [
    {
        "Title": "Frosty the snowman song",
        "ISBN": "1",
        "Content": [
            {
                "Page": 1,
                "Line": 1,
                "Text": "Frosty the snowman"
            },
            {
                "Page": 1,
                "Line": 2,
                "Text": "was a jolly happy soul."
            }
        ]
    },
    {
        "Title": "Geology 101",
        "ISBN": "2",
        "Content": [
            {
                "Page": 1,
                "Line": 1,
                "Text": "A rock is a substance that contains"
            }
        ]
    },
    {
        "Title": "Common Christmas Songs",
        "ISBN": "3",
        "Content": [
            {
                "Page": 1,
                "Line": 1,
                "Text": "Many christmas songs include fictional"
            },
            {
                "Page": 1,
                "Line": 2,
                "Text": "characters, for example: Frosty the Snowman."
            }
        ]
    },
    {
        "Title": "Empty",
        "ISBN": "10",
        "Content": [
        ]
    }
]

const multipleBooksTest = findSearchTermInBooks("Frosty", manyBooks);
const multipleBooksOut = {
    "SearchTerm": "Frosty",
    "Results": [
        {
        "ISBN": "1",
        "Page": 1,
        "Line": 1
        },
        {
        "ISBN": "3",
        "Page": 1,
        "Line": 2
        }
    ]
}

if (JSON.stringify(multipleBooksTest) === JSON.stringify(multipleBooksOut)) {
    console.log("PASS: Multiple books test");
} else {
    console.log("FAIL: Multiple books test");
    console.log("Expected:", multipleBooksOut);
    console.log("Received:", multipleBooksTest);
}


/**
 * Beginning of line test
 * 
 * Test a search term that is the beginning of a line
 */
const beginningOfLineBook =
[
    {
    "Title": "Frosty the snowman song",
    "ISBN": "1",
    "Content": [
        {
            "Page": 1,
            "Line": 1,
            "Text": "Frosty the snowman"
        },
        {
            "Page": 1,
            "Line": 2,
            "Text": "was a jolly happy soul."
        }
    ]
    }
]

const beginningOfLineTest = findSearchTermInBooks("Frosty", beginningOfLineBook);
const beginningOfLineOut = {
    "SearchTerm": "Frosty",
    "Results": [
        {
        "ISBN": "1",
        "Page": 1,
        "Line": 1
        }
    ]
}

if (JSON.stringify(beginningOfLineTest) === JSON.stringify(beginningOfLineOut)) {
    console.log("PASS: Beginning of line test");
} else {
    console.log("FAIL: Beginning of line test");
    console.log("Expected:", beginningOfLineOut);
    console.log("Received:", beginningOfLineTest);
}



/**
 * Case-sensitive test
 * 
 * Test a search term which is found in the book in a different case.
 * i.e.
 * search term "frosty" is found in a different case in:
    * Frosty the snowman
    * was a jolly happy soul.
 */
const caseSensitiveTest = findSearchTermInBooks("frosty", beginningOfLineBook);
const caseSensitiveOut = {
    "SearchTerm": "frosty",
    "Results": []
}

if (JSON.stringify(caseSensitiveTest) === JSON.stringify(caseSensitiveOut)) {
    console.log("PASS: Case-sensitive test");
} else {
    console.log("FAIL: Case-sensitive test");
    console.log("Expected:", caseSensitiveOut);
    console.log("Received:", caseSensitiveTest);
}
