const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('./models/Question');

dotenv.config();

// Blind 75 question IDs (FREE)
const blind75QuestionIds = ['1', '121', '217', '242', '238', '15', '11', '42', '125', '3', 
    '20', '155', '33', '153', '206', '141', '21', '143', '23', '19', 
    '226', '104', '100', '572', '235', '98', '105', '230', '124', '297',
    '200', '133', '207', '417',
    '39', '79',
    '208', '211', '212',
    '70', '322', '300', '139', '198', '213', '62',
    '55', '45',
    '56', '57', '435',
    '191', '338', '268'
];

// Import questions from frontend questions-bank.js format
const questionsBank = {
    '1': { id: 1, title: 'Two Sum', difficulty: 'Easy', category: 'DSA', tags: ['Array', 'Hash Table', 'Two Pointers'] },
    '49': { id: 49, title: 'Group Anagrams', difficulty: 'Medium', category: 'DSA', tags: ['Array', 'Hash Table', 'String', 'Sorting'] },
    '347': { id: 347, title: 'Top K Frequent Elements', difficulty: 'Medium', category: 'DSA', tags: ['Array', 'Hash Table', 'Heap', 'Bucket Sort'] },
    '238': { id: 238, title: 'Product of Array Except Self', difficulty: 'Medium', category: 'DSA', tags: ['Array', 'Prefix Sum'] },
    '128': { id: 128, title: 'Longest Consecutive Sequence', difficulty: 'Medium', category: 'DSA', tags: ['Array', 'Hash Table', 'Union Find'] },
    '125': { id: 125, title: 'Valid Palindrome', difficulty: 'Easy', category: 'DSA', tags: ['Two Pointers', 'String'] },
    '15': { id: 15, title: '3Sum', difficulty: 'Medium', category: 'DSA', tags: ['Array', 'Two Pointers', 'Sorting'] },
    '11': { id: 11, title: 'Container With Most Water', difficulty: 'Medium', category: 'DSA', tags: ['Array', 'Two Pointers', 'Greedy'] },
    '42': { id: 42, title: 'Trapping Rain Water', difficulty: 'Hard', category: 'DSA', tags: ['Array', 'Two Pointers', 'DP', 'Stack'] },
    '20': { id: 20, title: 'Valid Parentheses', difficulty: 'Easy', category: 'DSA', tags: ['String', 'Stack'] },
    '155': { id: 155, title: 'Min Stack', difficulty: 'Medium', category: 'DSA', tags: ['Stack', 'Design'] },
    '704': { id: 704, title: 'Binary Search', difficulty: 'Easy', category: 'DSA', tags: ['Array', 'Binary Search'] },
    '74': { id: 74, title: 'Search a 2D Matrix', difficulty: 'Medium', category: 'DSA', tags: ['Array', 'Binary Search', 'Matrix'] },
    '206': { id: 206, title: 'Reverse Linked List', difficulty: 'Easy', category: 'DSA', tags: ['Linked List', 'Recursion'] },
    '21': { id: 21, title: 'Merge Two Sorted Lists', difficulty: 'Easy', category: 'DSA', tags: ['Linked List', 'Recursion'] },
    '226': { id: 226, title: 'Invert Binary Tree', difficulty: 'Easy', category: 'DSA', tags: ['Tree', 'DFS', 'BFS', 'Binary Tree'] },
    '104': { id: 104, title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', category: 'DSA', tags: ['Tree', 'DFS', 'BFS', 'Binary Tree'] },
    '100': { id: 100, title: 'Same Tree', difficulty: 'Easy', category: 'DSA', tags: ['Tree', 'DFS', 'BFS', 'Binary Tree'] },
    '572': { id: 572, title: 'Subtree of Another Tree', difficulty: 'Easy', category: 'DSA', tags: ['Tree', 'DFS', 'String Matching', 'Binary Tree'] },
    '853': { id: 853, title: 'Car Fleet', difficulty: 'Medium', category: 'DSA', tags: ['Array', 'Stack', 'Sorting', 'Monotonic Stack'] },
    '200': { id: 200, title: 'Number of Islands', difficulty: 'Medium', category: 'DSA', tags: ['Array', 'DFS', 'BFS', 'Union Find', 'Matrix'] },
    '133': { id: 133, title: 'Clone Graph', difficulty: 'Medium', category: 'DSA', tags: ['Hash Table', 'DFS', 'BFS', 'Graph'] },
    '417': { id: 417, title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', category: 'DSA', tags: ['Array', 'DFS', 'BFS', 'Matrix'] },
    '207': { id: 207, title: 'Course Schedule', difficulty: 'Medium', category: 'DSA', tags: ['DFS', 'BFS', 'Graph', 'Topological Sort'] },
    '150': { id: 150, title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', category: 'DSA', tags: ['Array', 'Math', 'Stack'] },
    '22': { id: 22, title: 'Generate Parentheses', difficulty: 'Medium', category: 'DSA', tags: ['String', 'DP', 'Backtracking'] },
    '84': { id: 84, title: 'Largest Rectangle in Histogram', difficulty: 'Hard', category: 'DSA', tags: ['Array', 'Stack', 'Monotonic Stack'] },
    '33': { id: 33, title: 'Search in Rotated Sorted Array', difficulty: 'Medium', category: 'DSA', tags: ['Array', 'Binary Search'] },
    '4': { id: 4, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', category: 'DSA', tags: ['Array', 'Binary Search', 'Divide and Conquer'] },
    '143': { id: 143, title: 'Reorder List', difficulty: 'Medium', category: 'DSA', tags: ['Linked List', 'Two Pointers', 'Stack', 'Recursion'] },
    '19': { id: 19, title: 'Remove Nth Node From End of List', difficulty: 'Medium', category: 'DSA', tags: ['Linked List', 'Two Pointers'] },
    '23': { id: 23, title: 'Merge k Sorted Lists', difficulty: 'Hard', category: 'DSA', tags: ['Linked List', 'Divide and Conquer', 'Heap', 'Merge Sort'] },
    '102': { id: 102, title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', category: 'DSA', tags: ['Tree', 'BFS', 'Binary Tree'] },
    '105': { id: 105, title: 'Construct Binary Tree from Preorder and Inorder Traversal', difficulty: 'Medium', category: 'DSA', tags: ['Array', 'Hash Table', 'Divide and Conquer', 'Tree', 'Binary Tree'] },
    '98': { id: 98, title: 'Validate Binary Search Tree', difficulty: 'Medium', category: 'DSA', tags: ['Tree', 'DFS', 'BST', 'Binary Tree'] },
    '124': { id: 124, title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', category: 'DSA', tags: ['DP', 'Tree', 'DFS', 'Binary Tree'] },
    '297': { id: 297, title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', category: 'DSA', tags: ['String', 'Tree', 'DFS', 'BFS', 'Design', 'Binary Tree'] },
    '703': { id: 703, title: 'Kth Largest Element in a Stream', difficulty: 'Easy', category: 'DSA', tags: ['Tree', 'Design', 'BST', 'Heap'] },
    '215': { id: 215, title: 'Kth Largest Element in an Array', difficulty: 'Medium', category: 'DSA', tags: ['Array', 'Divide and Conquer', 'Sorting', 'Heap', 'Quickselect'] },
    '295': { id: 295, title: 'Find Median from Data Stream', difficulty: 'Hard', category: 'DSA', tags: ['Two Pointers', 'Design', 'Sorting', 'Heap', 'Data Stream'] },
    '39': { id: 39, title: 'Combination Sum', difficulty: 'Medium', category: 'DSA', tags: ['Array', 'Backtracking'] },
    '79': { id: 79, title: 'Word Search', difficulty: 'Medium', category: 'DSA', tags: ['Array', 'Backtracking', 'Matrix'] },
    '51': { id: 51, title: 'N-Queens', difficulty: 'Hard', category: 'DSA', tags: ['Array', 'Backtracking'] },
    '208': { id: 208, title: 'Implement Trie (Prefix Tree)', difficulty: 'Medium', category: 'DSA', tags: ['Hash Table', 'String', 'Design', 'Trie'] },
    '211': { id: 211, title: 'Design Add and Search Words Data Structure', difficulty: 'Medium', category: 'DSA', tags: ['String', 'DFS', 'Design', 'Trie'] },
    '212': { id: 212, title: 'Word Search II', difficulty: 'Hard', category: 'DSA', tags: ['Array', 'String', 'Backtracking', 'Trie', 'Matrix'] },
    '70': { id: 70, title: 'Climbing Stairs', difficulty: 'Easy', category: 'DSA', tags: ['Math', 'DP', 'Memoization'] },
    '198': { id: 198, title: 'House Robber', difficulty: 'Medium', category: 'DSA', tags: ['Array', 'DP'] },
    '322': { id: 322, title: 'Coin Change', difficulty: 'Medium', category: 'DSA', tags: ['Array', 'DP', 'BFS'] },
    '300': { id: 300, title: 'Longest Increasing Subsequence', difficulty: 'Medium', category: 'DSA', tags: ['Array', 'DP', 'Binary Search'] },
    '72': { id: 72, title: 'Edit Distance', difficulty: 'Medium', category: 'DSA', tags: ['String', 'DP'] },
    '121': { id: 121, title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', category: 'DSA', tags: ['Array', 'DP'] },
    '217': { id: 217, title: 'Contains Duplicate', difficulty: 'Easy', category: 'DSA', tags: ['Array', 'Hash Table', 'Sorting'] },
    '242': { id: 242, title: 'Valid Anagram', difficulty: 'Easy', category: 'DSA', tags: ['Hash Table', 'String', 'Sorting'] },
    '55': { id: 55, title: 'Jump Game', difficulty: 'Medium', category: 'DSA', tags: ['Array', 'DP', 'Greedy'] },
    '45': { id: 45, title: 'Jump Game II', difficulty: 'Medium', category: 'DSA', tags: ['Array', 'DP', 'Greedy'] },
    '57': { id: 57, title: 'Insert Interval', difficulty: 'Medium', category: 'DSA', tags: ['Array'] },
    '56': { id: 56, title: 'Merge Intervals', difficulty: 'Medium', category: 'DSA', tags: ['Array', 'Sorting'] },
    '435': { id: 435, title: 'Non-overlapping Intervals', difficulty: 'Medium', category: 'DSA', tags: ['Array', 'DP', 'Greedy', 'Sorting'] }
};

// Topic mapping based on common patterns
const topicMapping = {
    'Array': 'Arrays & Hashing',
    'Hash Table': 'Arrays & Hashing',
    'Two Pointers': 'Two Pointers',
    'String': 'Arrays & Hashing',
    'Stack': 'Stack',
    'Binary Search': 'Binary Search',
    'Linked List': 'Linked List',
    'Tree': 'Trees',
    'Binary Tree': 'Trees',
    'BST': 'Trees',
    'Trie': 'Tries',
    'Heap': 'Heap / Priority Queue',
    'Backtracking': 'Backtracking',
    'Graph': 'Graphs',
    'DFS': 'Graphs',
    'BFS': 'Graphs',
    'DP': '1-D DP',
    'Greedy': 'Greedy',
    'Sorting': 'Arrays & Hashing',
    'Math': 'Math & Geometry',
    'Bit Manipulation': 'Bit Manipulation'
};

function getTopic(tags) {
    for (const tag of tags) {
        if (topicMapping[tag]) {
            return topicMapping[tag];
        }
    }
    return 'Arrays & Hashing'; // default
}

// Test cases for specific questions (more can be added)
const testCasesMap = {
    '1': [ // Two Sum
        { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]', isHidden: false },
        { input: '[3,2,4]\n6', expectedOutput: '[1,2]', isHidden: false },
        { input: '[3,3]\n6', expectedOutput: '[0,1]', isHidden: true }
    ],
    '125': [ // Valid Palindrome
        { input: 'A man, a plan, a canal: Panama', expectedOutput: 'true', isHidden: false },
        { input: 'race a car', expectedOutput: 'false', isHidden: false },
        { input: ' ', expectedOutput: 'true', isHidden: true }
    ],
    '20': [ // Valid Parentheses
        { input: '()', expectedOutput: 'true', isHidden: false },
        { input: '()[]{}', expectedOutput: 'true', isHidden: false },
        { input: '(]', expectedOutput: 'false', isHidden: false },
        { input: '([)]', expectedOutput: 'false', isHidden: true }
    ],
    '704': [ // Binary Search
        { input: '[-1,0,3,5,9,12]\n9', expectedOutput: '4', isHidden: false },
        { input: '[-1,0,3,5,9,12]\n2', expectedOutput: '-1', isHidden: false },
        { input: '[5]\n5', expectedOutput: '0', isHidden: true }
    ],
    '121': [ // Best Time to Buy and Sell Stock
        { input: '[7,1,5,3,6,4]', expectedOutput: '5', isHidden: false },
        { input: '[7,6,4,3,1]', expectedOutput: '0', isHidden: false },
        { input: '[2,4,1]', expectedOutput: '2', isHidden: true }
    ],
    '217': [ // Contains Duplicate
        { input: '[1,2,3,1]', expectedOutput: 'true', isHidden: false },
        { input: '[1,2,3,4]', expectedOutput: 'false', isHidden: false },
        { input: '[1,1,1,3,3,4,3,2,4,2]', expectedOutput: 'true', isHidden: true }
    ],
    '242': [ // Valid Anagram
        { input: 'anagram\nnagaram', expectedOutput: 'true', isHidden: false },
        { input: 'rat\ncar', expectedOutput: 'false', isHidden: false },
        { input: 'a\nab', expectedOutput: 'false', isHidden: true }
    ],
    '206': [ // Reverse Linked List (simplified test)
        { input: '[1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]', isHidden: false },
        { input: '[1,2]', expectedOutput: '[2,1]', isHidden: false },
        { input: '[]', expectedOutput: '[]', isHidden: true }
    ]
};

// Function name mapping for different questions
const functionNamesMap = {
    '1': 'twoSum',
    '125': 'isPalindrome', 
    '20': 'isValid',
    '704': 'search',
    '121': 'maxProfit',
    '217': 'containsDuplicate',
    '242': 'isAnagram',
    '206': 'reverseList',
    '21': 'mergeTwoLists',
    '226': 'invertTree',
    '104': 'maxDepth',
    '100': 'isSameTree',
    '11': 'maxArea',
    '15': 'threeSum',
    '49': 'groupAnagrams',
    '347': 'topKFrequent',
    '238': 'productExceptSelf'
};

// Descriptions for questions
const descriptionsMap = {
    '1': 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    '125': 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
    '20': 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
    '704': 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.',
    '121': 'You are given an array prices where prices[i] is the price of a given stock on the ith day. Find the maximum profit you can achieve.',
    '217': 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
    '242': 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
    '206': 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    '21': 'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list.',
    '226': 'Given the root of a binary tree, invert the tree, and return its root.',
    '104': 'Given the root of a binary tree, return its maximum depth.',
    '100': 'Given the roots of two binary trees p and q, write a function to check if they are the same or not.',
    '11': 'You are given an integer array height of length n. Find two lines that together with the x-axis form a container, such that the container contains the most water.',
    '15': 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.',
    '49': 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
    '347': 'Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.',
    '238': 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].'
};

// Starter code templates with proper function signatures
const starterCodeMap = {
    '1': {
        python: 'def twoSum(nums, target):\n    # Write your solution here\n    pass',
        javascript: 'function twoSum(nums, target) {\n    // Write your solution here\n}',
        java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n    }\n}',
        cpp: 'vector<int> twoSum(vector<int>& nums, int target) {\n    // Write your solution here\n}',
        c: 'int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your solution here\n}'
    },
    '125': {
        python: 'def isPalindrome(s):\n    # Write your solution here\n    pass',
        javascript: 'function isPalindrome(s) {\n    // Write your solution here\n}',
        java: 'class Solution {\n    public boolean isPalindrome(String s) {\n        // Write your solution here\n    }\n}',
        cpp: 'bool isPalindrome(string s) {\n    // Write your solution here\n}',
        c: 'bool isPalindrome(char* s) {\n    // Write your solution here\n}'
    },
    '20': {
        python: 'def isValid(s):\n    # Write your solution here\n    pass',
        javascript: 'function isValid(s) {\n    // Write your solution here\n}',
        java: 'class Solution {\n    public boolean isValid(String s) {\n        // Write your solution here\n    }\n}',
        cpp: 'bool isValid(string s) {\n    // Write your solution here\n}',
        c: 'bool isValid(char* s) {\n    // Write your solution here\n}'
    },
    '704': {
        python: 'def search(nums, target):\n    # Write your solution here\n    pass',
        javascript: 'function search(nums, target) {\n    // Write your solution here\n}',
        java: 'class Solution {\n    public int search(int[] nums, int target) {\n        // Write your solution here\n    }\n}',
        cpp: 'int search(vector<int>& nums, int target) {\n    // Write your solution here\n}',
        c: 'int search(int* nums, int numsSize, int target) {\n    // Write your solution here\n}'
    }
};

// Convert questions-bank format to database format
const convertedQuestions = Object.entries(questionsBank).map(([id, q]) => {
    // Get test cases for this question, or use simple defaults
    const testCases = testCasesMap[id] || [
        { input: '[]', expectedOutput: '[]', isHidden: false },
        { input: '[1]', expectedOutput: '[1]', isHidden: true }
    ];
    
    // Get starter code for this question, or use generic defaults
    const starterCode = starterCodeMap[id] || {
        python: `def solution():\n    # Write your solution here\n    pass`,
        javascript: `function solution() {\n    // Write your solution here\n}`,
        java: `class Solution {\n    // Write your solution here\n}`,
        cpp: `// Write your solution here`,
        c: `// Write your solution here`
    };
    
    // Get description or use generic one
    const description = descriptionsMap[id] || `Solve the ${q.title} problem. This is a ${q.difficulty} level question that tests your understanding of ${q.tags?.join(', ')}.`;
    
    // Get function name for this problem
    const functionName = functionNamesMap[id] || 'solution';
    
    return {
        questionId: id,
        type: 'DSA',
        title: q.title,
        description: description,
        difficulty: q.difficulty,
        topic: getTopic(q.tags || []),
        timeLimit: 30,
        constraints: 'Standard constraints apply.',
        examples: [{
            input: testCases[0]?.input || 'Example input',
            output: testCases[0]?.expectedOutput || 'Example output',
            explanation: 'See test cases for details.'
        }],
        tags: q.tags || [],
        starterCode: starterCode,
        testCases: testCases,
        functionName: functionName,  // Add function name for dynamic execution
        hints: [],
        basicExplanation: `This is a ${q.difficulty} problem that tests ${q.tags?.join(', ')} concepts.`,
        isPremium: false, // All questions are FREE
        neetCodeLists: {
            blind75: true, // All questions in Blind 75
            neetCode150: false,
            neetCode250: false
        },
        acceptanceRate: 45.0,
        totalSubmissions: 0,
        totalAccepted: 0,
        companies: [],
        relatedProblems: []
    };
});

async function seedQuestions() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        console.log('🗑️  Clearing existing questions...');
        await Question.deleteMany({});
        console.log('✅ Cleared existing questions');

        console.log('📝 Seeding questions...');
        await Question.insertMany(convertedQuestions);
        console.log(`✅ Successfully seeded ${convertedQuestions.length} questions`);

        console.log('\n📊 Question Summary:');
        const easy = convertedQuestions.filter(q => q.difficulty === 'Easy').length;
        const medium = convertedQuestions.filter(q => q.difficulty === 'Medium').length;
        const hard = convertedQuestions.filter(q => q.difficulty === 'Hard').length;
        const blind75 = convertedQuestions.filter(q => q.neetCodeLists.blind75).length;
        const premium = convertedQuestions.filter(q => q.isPremium).length;
        console.log(`   Easy: ${easy}`);
        console.log(`   Medium: ${medium}`);
        console.log(`   Hard: ${hard}`);
        console.log(`   Blind 75 (FREE): ${blind75} - ALL QUESTIONS`);
        console.log(`   Premium: ${premium}`);
        console.log(`   Total: ${convertedQuestions.length}`);

        mongoose.connection.close();
        console.log('\n🎉 Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding questions:', error);
        process.exit(1);
    }
}

seedQuestions();
