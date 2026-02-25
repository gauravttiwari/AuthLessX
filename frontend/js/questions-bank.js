// Question Bank for AuthLessX Coding Platform
const questionsBank = {
    // Array & Hashing
    '1': {
        id: 1,
        title: 'Two Sum',
        difficulty: 'Easy',
        category: 'DSA',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
        constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.',
        examples: [
            {
                input: 'nums = [2,7,11,15], target = 9',
                output: '[0,1]',
                explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
            },
            {
                input: 'nums = [3,2,4], target = 6',
                output: '[1,2]',
                explanation: 'nums[1] + nums[2] == 6, so we return [1, 2].'
            }
        ],
        tags: ['Array', 'Hash Table', 'Two Pointers'],
        starterCode: {
            javascript: `function twoSum(nums, target) {\n    // Write your code here\n    \n}\n\n// Test cases\nconsole.log(twoSum([2,7,11,15], 9)); // Expected: [0,1]\nconsole.log(twoSum([3,2,4], 6));     // Expected: [1,2]`,
            python: `def two_sum(nums, target):\n    # Write your code here\n    pass\n\n# Test cases\nprint(two_sum([2,7,11,15], 9))  # Expected: [0,1]\nprint(two_sum([3,2,4], 6))      # Expected: [1,2]`,
            java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}`
        },
        timeLimit: 30
    },
    '49': {
        id: 49,
        title: 'Group Anagrams',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
        constraints: '1 <= strs.length <= 10^4\n0 <= strs[i].length <= 100\nstrs[i] consists of lowercase English letters.',
        examples: [
            {
                input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
                output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
                explanation: 'Words with same letters are grouped together.'
            }
        ],
        tags: ['Array', 'Hash Table', 'String', 'Sorting'],
        starterCode: {
            javascript: `function groupAnagrams(strs) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(groupAnagrams(["eat","tea","tan","ate","nat","bat"]));`,
            python: `def group_anagrams(strs):\n    # Write your code here\n    pass\n\n# Test\nprint(group_anagrams(["eat","tea","tan","ate","nat","bat"]))`,
            java: `class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}`
        },
        timeLimit: 30
    },
    '347': {
        id: 347,
        title: 'Top K Frequent Elements',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.',
        constraints: '1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4\nk is in the range [1, the number of unique elements in the array].',
        examples: [
            {
                input: 'nums = [1,1,1,2,2,3], k = 2',
                output: '[1,2]',
                explanation: '1 appears 3 times, 2 appears 2 times.'
            }
        ],
        tags: ['Array', 'Hash Table', 'Heap', 'Bucket Sort'],
        starterCode: {
            javascript: `function topKFrequent(nums, k) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(topKFrequent([1,1,1,2,2,3], 2));`,
            python: `def top_k_frequent(nums, k):\n    # Write your code here\n    pass\n\n# Test\nprint(top_k_frequent([1,1,1,2,2,3], 2))`,
            java: `class Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        // Write your code here\n        return new int[k];\n    }\n}`
        },
        timeLimit: 30
    },
    '238': {
        id: 238,
        title: 'Product of Array Except Self',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].\n\nThe product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.\n\nYou must write an algorithm that runs in O(n) time and without using the division operation.',
        constraints: '2 <= nums.length <= 10^5\n-30 <= nums[i] <= 30\nThe product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.',
        examples: [
            {
                input: 'nums = [1,2,3,4]',
                output: '[24,12,8,6]',
                explanation: 'Product except self for each position.'
            }
        ],
        tags: ['Array', 'Prefix Sum'],
        starterCode: {
            javascript: `function productExceptSelf(nums) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(productExceptSelf([1,2,3,4]));`,
            python: `def product_except_self(nums):\n    # Write your code here\n    pass\n\n# Test\nprint(product_except_self([1,2,3,4]))`,
            java: `class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        // Write your code here\n        return new int[nums.length];\n    }\n}`
        },
        timeLimit: 30
    },
    '128': {
        id: 128,
        title: 'Longest Consecutive Sequence',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.\n\nYou must write an algorithm that runs in O(n) time.',
        constraints: '0 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9',
        examples: [
            {
                input: 'nums = [100,4,200,1,3,2]',
                output: '4',
                explanation: 'The longest consecutive sequence is [1, 2, 3, 4]. Therefore its length is 4.'
            }
        ],
        tags: ['Array', 'Hash Table', 'Union Find'],
        starterCode: {
            javascript: `function longestConsecutive(nums) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(longestConsecutive([100,4,200,1,3,2]));`,
            python: `def longest_consecutive(nums):\n    # Write your code here\n    pass\n\n# Test\nprint(longest_consecutive([100,4,200,1,3,2]))`,
            java: `class Solution {\n    public int longestConsecutive(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}`
        },
        timeLimit: 30
    },
    // Two Pointers
    '125': {
        id: 125,
        title: 'Valid Palindrome',
        difficulty: 'Easy',
        category: 'DSA',
        description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string s, return true if it is a palindrome, or false otherwise.',
        constraints: '1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.',
        examples: [
            {
                input: 's = "A man, a plan, a canal: Panama"',
                output: 'true',
                explanation: '"amanaplanacanalpanama" is a palindrome.'
            }
        ],
        tags: ['String', 'Two Pointers'],
        starterCode: {
            javascript: `function isPalindrome(s) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(isPalindrome("A man, a plan, a canal: Panama"));`,
            python: `def is_palindrome(s):\n    # Write your code here\n    pass\n\n# Test\nprint(is_palindrome("A man, a plan, a canal: Panama"))`,
            java: `class Solution {\n    public boolean isPalindrome(String s) {\n        // Write your code here\n        return false;\n    }\n}`
        },
        timeLimit: 30
    },
    '15': {
        id: 15,
        title: '3Sum',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.\n\nNotice that the solution set must not contain duplicate triplets.',
        constraints: '3 <= nums.length <= 3000\n-10^5 <= nums[i] <= 10^5',
        examples: [
            {
                input: 'nums = [-1,0,1,2,-1,-4]',
                output: '[[-1,-1,2],[-1,0,1]]',
                explanation: 'Three numbers sum to zero.'
            }
        ],
        tags: ['Array', 'Two Pointers', 'Sorting'],
        starterCode: {
            javascript: `function threeSum(nums) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(threeSum([-1,0,1,2,-1,-4]));`,
            python: `def three_sum(nums):\n    # Write your code here\n    pass\n\n# Test\nprint(three_sum([-1,0,1,2,-1,-4]))`,
            java: `class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}`
        },
        timeLimit: 30
    },
    '11': {
        id: 11,
        title: 'Container With Most Water',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.',
        constraints: 'n == height.length\n2 <= n <= 10^5\n0 <= height[i] <= 10^4',
        examples: [
            {
                input: 'height = [1,8,6,2,5,4,8,3,7]',
                output: '49',
                explanation: 'The maximum area of water is between index 1 and 8.'
            }
        ],
        tags: ['Array', 'Two Pointers', 'Greedy'],
        starterCode: {
            javascript: `function maxArea(height) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(maxArea([1,8,6,2,5,4,8,3,7]));`,
            python: `def max_area(height):\n    # Write your code here\n    pass\n\n# Test\nprint(max_area([1,8,6,2,5,4,8,3,7]))`,
            java: `class Solution {\n    public int maxArea(int[] height) {\n        // Write your code here\n        return 0;\n    }\n}`
        },
        timeLimit: 30
    },
    '42': {
        id: 42,
        title: 'Trapping Rain Water',
        difficulty: 'Hard',
        category: 'DSA',
        description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
        constraints: 'n == height.length\n1 <= n <= 2 * 10^4\n0 <= height[i] <= 10^5',
        examples: [
            {
                input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
                output: '6',
                explanation: 'Water trapped between the bars.'
            }
        ],
        tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'],
        starterCode: {
            javascript: `function trap(height) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(trap([0,1,0,2,1,0,1,3,2,1,2,1]));`,
            python: `def trap(height):\n    # Write your code here\n    pass\n\n# Test\nprint(trap([0,1,0,2,1,0,1,3,2,1,2,1]))`,
            java: `class Solution {\n    public int trap(int[] height) {\n        // Write your code here\n        return 0;\n    }\n}`
        },
        timeLimit: 30
    },
    // Stack
    '20': {
        id: 20,
        title: 'Valid Parentheses',
        difficulty: 'Easy',
        category: 'DSA',
        description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
        constraints: '1 <= s.length <= 10^4\ns consists of parentheses only \'()[]{}\'.',
        examples: [
            {
                input: 's = "()"',
                output: 'true'
            },
            {
                input: 's = "()[]{}"',
                output: 'true'
            },
            {
                input: 's = "(]"',
                output: 'false'
            }
        ],
        tags: ['String', 'Stack'],
        starterCode: {
            javascript: `function isValid(s) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(isValid("()"));     // true\nconsole.log(isValid("()[]{}"));  // true\nconsole.log(isValid("(]"));      // false`,
            python: `def is_valid(s):\n    # Write your code here\n    pass\n\n# Test\nprint(is_valid("()"))      # True\nprint(is_valid("()[]{}"))  # True\nprint(is_valid("(]"))      # False`,
            java: `class Solution {\n    public boolean isValid(String s) {\n        // Write your code here\n        return false;\n    }\n}`
        },
        timeLimit: 30
    },
    '155': {
        id: 155,
        title: 'Min Stack',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.\n\nImplement the MinStack class:\n- MinStack() initializes the stack object.\n- void push(int val) pushes the element val onto the stack.\n- void pop() removes the element on the top of the stack.\n- int top() gets the top element of the stack.\n- int getMin() retrieves the minimum element in the stack.',
        constraints: '-2^31 <= val <= 2^31 - 1\nMethods pop, top and getMin operations will always be called on non-empty stacks.\nAt most 3 * 10^4 calls will be made to push, pop, top, and getMin.',
        examples: [
            {
                input: '["MinStack","push","push","push","getMin","pop","top","getMin"]\\n[[],[-2],[0],[-3],[],[],[],[]]',
                output: '[null,null,null,null,-3,null,0,-2]',
                explanation: 'Operations on the stack.'
            }
        ],
        tags: ['Stack', 'Design'],
        starterCode: {
            javascript: `class MinStack {\n    constructor() {\n        // Initialize your data structure here\n    }\n    \n    push(val) {\n        // Push element val onto stack\n    }\n    \n    pop() {\n        // Remove the element on top of the stack\n    }\n    \n    top() {\n        // Get the top element\n    }\n    \n    getMin() {\n        // Retrieve the minimum element\n    }\n}\n\n// Test\nconst stack = new MinStack();\nstack.push(-2);\nstack.push(0);\nstack.push(-3);\nconsole.log(stack.getMin()); // -3\nstack.pop();\nconsole.log(stack.top());    // 0\nconsole.log(stack.getMin()); // -2`,
            python: `class MinStack:\n    def __init__(self):\n        # Initialize your data structure here\n        pass\n    \n    def push(self, val):\n        # Push element val onto stack\n        pass\n    \n    def pop(self):\n        # Remove the element on top of the stack\n        pass\n    \n    def top(self):\n        # Get the top element\n        pass\n    \n    def get_min(self):\n        # Retrieve the minimum element\n        pass\n\n# Test\nstack = MinStack()\nstack.push(-2)\nstack.push(0)\nstack.push(-3)\nprint(stack.get_min())  # -3\nstack.pop()\nprint(stack.top())      # 0\nprint(stack.get_min())  # -2`,
            java: `class MinStack {\n    public MinStack() {\n        // Initialize your data structure here\n    }\n    \n    public void push(int val) {\n        // Push element val onto stack\n    }\n    \n    public void pop() {\n        // Remove the element on top of the stack\n    }\n    \n    public int top() {\n        // Get the top element\n        return 0;\n    }\n    \n    public int getMin() {\n        // Retrieve the minimum element\n        return 0;\n    }\n}`
        },
        timeLimit: 30
    },
    // Binary Search
    '704': {
        id: 704,
        title: 'Binary Search',
        difficulty: 'Easy',
        category: 'DSA',
        description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.\n\nYou must write an algorithm with O(log n) runtime complexity.',
        constraints: '1 <= nums.length <= 10^4\n-10^4 < nums[i], target < 10^4\nAll the integers in nums are unique.\nnums is sorted in ascending order.',
        examples: [
            {
                input: 'nums = [-1,0,3,5,9,12], target = 9',
                output: '4',
                explanation: '9 exists in nums and its index is 4'
            }
        ],
        tags: ['Array', 'Binary Search'],
        starterCode: {
            javascript: `function search(nums, target) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(search([-1,0,3,5,9,12], 9));`,
            python: `def search(nums, target):\n    # Write your code here\n    pass\n\n# Test\nprint(search([-1,0,3,5,9,12], 9))`,
            java: `class Solution {\n    public int search(int[] nums, int target) {\n        // Write your code here\n        return -1;\n    }\n}`
        },
        timeLimit: 30
    },
    '74': {
        id: 74,
        title: 'Search a 2D Matrix',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'You are given an m x n integer matrix matrix with the following two properties:\n- Each row is sorted in non-decreasing order.\n- The first integer of each row is greater than the last integer of the previous row.\n\nGiven an integer target, return true if target is in matrix or false otherwise.\n\nYou must write a solution in O(log(m * n)) time complexity.',
        constraints: 'm == matrix.length\nn == matrix[i].length\n1 <= m, n <= 100\n-10^4 <= matrix[i][j], target <= 10^4',
        examples: [
            {
                input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3',
                output: 'true'
            }
        ],
        tags: ['Array', 'Binary Search', 'Matrix'],
        starterCode: {
            javascript: `function searchMatrix(matrix, target) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(searchMatrix([[1,3,5,7],[10,11,16,20],[23,30,34,60]], 3));`,
            python: `def search_matrix(matrix, target):\n    # Write your code here\n    pass\n\n# Test\nprint(search_matrix([[1,3,5,7],[10,11,16,20],[23,30,34,60]], 3))`,
            java: `class Solution {\n    public boolean searchMatrix(int[][] matrix, int target) {\n        // Write your code here\n        return false;\n    }\n}`
        },
        timeLimit: 30
    },
    // Linked List
    '206': {
        id: 206,
        title: 'Reverse Linked List',
        difficulty: 'Easy',
        category: 'DSA',
        description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
        constraints: 'The number of nodes in the list is the range [0, 5000].\n-5000 <= Node.val <= 5000',
        examples: [
            {
                input: 'head = [1,2,3,4,5]',
                output: '[5,4,3,2,1]'
            }
        ],
        tags: ['Linked List', 'Recursion'],
        starterCode: {
            javascript: `function reverseList(head) {\n    // Write your code here\n    \n}\n\n// Test\n// head = [1,2,3,4,5]\nconsole.log(reverseList(head));`,
            python: `def reverse_list(head):\n    # Write your code here\n    pass\n\n# Test\n# head = [1,2,3,4,5]\nprint(reverse_list(head))`,
            java: `class Solution {\n    public ListNode reverseList(ListNode head) {\n        // Write your code here\n        return null;\n    }\n}`
        },
        timeLimit: 30
    },
    '21': {
        id: 21,
        title: 'Merge Two Sorted Lists',
        difficulty: 'Easy',
        category: 'DSA',
        description: 'You are given the heads of two sorted linked lists list1 and list2.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.',
        constraints: 'The number of nodes in both lists is in the range [0, 50].\n-100 <= Node.val <= 100\nBoth list1 and list2 are sorted in non-decreasing order.',
        examples: [
            {
                input: 'list1 = [1,2,4], list2 = [1,3,4]',
                output: '[1,1,2,3,4,4]'
            }
        ],
        tags: ['Linked List', 'Recursion'],
        starterCode: {
            javascript: `function mergeTwoLists(list1, list2) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(mergeTwoLists([1,2,4], [1,3,4]));`,
            python: `def merge_two_lists(list1, list2):\n    # Write your code here\n    pass\n\n# Test\nprint(merge_two_lists([1,2,4], [1,3,4]))`,
            java: `class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Write your code here\n        return null;\n    }\n}`
        },
        timeLimit: 30
    },
    // Trees
    '226': {
        id: 226,
        title: 'Invert Binary Tree',
        difficulty: 'Easy',
        category: 'DSA',
        description: 'Given the root of a binary tree, invert the tree, and return its root.',
        constraints: 'The number of nodes in the tree is in the range [0, 100].\n-100 <= Node.val <= 100',
        examples: [
            {
                input: 'root = [4,2,7,1,3,6,9]',
                output: '[4,7,2,9,6,3,1]',
                explanation: 'The tree is inverted.'
            }
        ],
        tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
        starterCode: {
            javascript: `function invertTree(root) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(invertTree([4,2,7,1,3,6,9]));`,
            python: `def invert_tree(root):\n    # Write your code here\n    pass\n\n# Test\nprint(invert_tree([4,2,7,1,3,6,9]))`,
            java: `class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        // Write your code here\n        return null;\n    }\n}`
        },
        timeLimit: 30
    },
    '104': {
        id: 104,
        title: 'Maximum Depth of Binary Tree',
        difficulty: 'Easy',
        category: 'DSA',
        description: 'Given the root of a binary tree, return its maximum depth.\n\nA binary tree\'s maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.',
        constraints: 'The number of nodes in the tree is in the range [0, 10^4].\n-100 <= Node.val <= 100',
        examples: [
            {
                input: 'root = [3,9,20,null,null,15,7]',
                output: '3',
                explanation: 'The maximum depth is 3.'
            }
        ],
        tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
        starterCode: {
            javascript: `function maxDepth(root) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(maxDepth([3,9,20,null,null,15,7]));`,
            python: `def max_depth(root):\n    # Write your code here\n    pass\n\n# Test\nprint(max_depth([3,9,20,None,None,15,7]))`,
            java: `class Solution {\n    public int maxDepth(TreeNode root) {\n        // Write your code here\n        return 0;\n    }\n}`
        },
        timeLimit: 30
    },
    '100': {
        id: 100,
        title: 'Same Tree',
        difficulty: 'Easy',
        category: 'DSA',
        description: 'Given the roots of two binary trees p and q, write a function to check if they are the same or not.\n\nTwo binary trees are considered the same if they are structurally identical, and the nodes have the same value.',
        constraints: 'The number of nodes in both trees is in the range [0, 100].\n-10^4 <= Node.val <= 10^4',
        examples: [
            {
                input: 'p = [1,2,3], q = [1,2,3]',
                output: 'true'
            },
            {
                input: 'p = [1,2], q = [1,null,2]',
                output: 'false'
            }
        ],
        tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
        starterCode: {
            javascript: `function isSameTree(p, q) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(isSameTree([1,2,3], [1,2,3]));`,
            python: `def is_same_tree(p, q):\n    # Write your code here\n    pass\n\n# Test\nprint(is_same_tree([1,2,3], [1,2,3]))`,
            java: `class Solution {\n    public boolean isSameTree(TreeNode p, TreeNode q) {\n        // Write your code here\n        return false;\n    }\n}`
        },
        timeLimit: 30
    },
    '572': {
        id: 572,
        title: 'Subtree of Another Tree',
        difficulty: 'Easy',
        category: 'DSA',
        description: 'Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and node values of subRoot and false otherwise.\n\nA subtree of a binary tree tree is a tree that consists of a node in tree and all of this node\'s descendants. The tree tree could also be considered as a subtree of itself.',
        constraints: 'The number of nodes in the root tree is in the range [1, 2000].\nThe number of nodes in the subRoot tree is in the range [1, 1000].\n-10^4 <= root.val <= 10^4\n-10^4 <= subRoot.val <= 10^4',
        examples: [
            {
                input: 'root = [3,4,5,1,2], subRoot = [4,1,2]',
                output: 'true'
            }
        ],
        tags: ['Tree', 'Depth-First Search', 'Binary Tree', 'String Matching', 'Hash Function'],
        starterCode: {
            javascript: `function isSubtree(root, subRoot) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(isSubtree([3,4,5,1,2], [4,1,2]));`,
            python: `def is_subtree(root, subRoot):\n    # Write your code here\n    pass\n\n# Test\nprint(is_subtree([3,4,5,1,2], [4,1,2]))`,
            java: `class Solution {\n    public boolean isSubtree(TreeNode root, TreeNode subRoot) {\n        // Write your code here\n        return false;\n    }\n}`
        },
        timeLimit: 30
    },
    // Missing questions from various categories
    '853': {
        id: 853,
        title: 'Car Fleet',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'There are n cars going to the same destination along a one-lane road. The destination is target miles away. You are given two integer array position and speed, both of length n, where position[i] is the position of the ith car and speed[i] is the speed of the ith car (in miles per hour). A car can never pass another car ahead of it, but it can catch up to it and drive bumper to bumper at the same speed. The faster car will slow down to match the slower car\'s speed. The distance between these two cars is ignored (i.e., they are assumed to have the same position). A car fleet is some non-empty set of cars driving at the same position and same speed. Note that a single car is also a car fleet. If a car catches up to a car fleet right at the destination point, it will still be considered as one car fleet. Return the number of car fleets that will arrive at the destination.',
        constraints: 'n == position.length == speed.length\n1 <= n <= 10^5\n0 < target <= 10^6\n0 <= position[i] < target\nAll the values of position are unique.\n0 < speed[i] <= 10^6',
        examples: [{input: 'target = 12, position = [10,8,0,5,3], speed = [2,4,1,1,3]', output: '3'}],
        tags: ['Array', 'Stack', 'Sorting'],
        starterCode: {
            javascript: `function carFleet(target, position, speed) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(carFleet(12, [10,8,0,5,3], [2,4,1,1,3]));`,
            python: `def car_fleet(target, position, speed):\n    # Write your code here\n    pass\n\n# Test\nprint(car_fleet(12, [10,8,0,5,3], [2,4,1,1,3]))`,
            java: `class Solution {\n    public int carFleet(int target, int[] position, int[] speed) {\n        // Write your code here\n        return 0;\n    }\n}`
        },
        timeLimit: 30
    },
    '200': {
        id: 200,
        title: 'Number of Islands',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'Given an m x n 2D binary grid grid which represents a map of \'1\'s (land) and \'0\'s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.',
        constraints: 'm == grid.length\nn == grid[i].length\n1 <= m, n <= 300\ngrid[i][j] is \'0\' or \'1\'.',
        examples: [{input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1'}],
        tags: ['Array', 'DFS', 'BFS', 'Union Find', 'Matrix'],
        starterCode: {
            javascript: `function numIslands(grid) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(numIslands([["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]));`,
            python: `def num_islands(grid):\n    # Write your code here\n    pass\n\n# Test\nprint(num_islands([["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]))`,
            java: `class Solution {\n    public int numIslands(char[][] grid) {\n        // Write your code here\n        return 0;\n    }\n}`
        },
        timeLimit: 30
    },
    '133': {
        id: 133,
        title: 'Clone Graph',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph. Each node in the graph contains a value (int) and a list (List[Node]) of its neighbors.',
        constraints: 'The number of nodes in the graph is in the range [0, 100].\n1 <= Node.val <= 100\nNode.val is unique for each node.\nThere are no repeated edges and no self-loops in the graph.\nThe Graph is connected and all nodes can be visited starting from the given node.',
        examples: [{input: 'adjList = [[2,4],[1,3],[2,4],[1,3]]', output: '[[2,4],[1,3],[2,4],[1,3]]'}],
        tags: ['Hash Table', 'DFS', 'BFS', 'Graph'],
        starterCode: {
            javascript: `function cloneGraph(node) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(cloneGraph(node));`,
            python: `def clone_graph(node):\n    # Write your code here\n    pass\n\n# Test\nprint(clone_graph(node))`,
            java: `class Solution {\n    public Node cloneGraph(Node node) {\n        // Write your code here\n        return null;\n    }\n}`
        },
        timeLimit: 30
    },
    '417': {
        id: 417,
        title: 'Pacific Atlantic Water Flow',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'There is an m x n rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The Pacific Ocean touches the island\'s left and top edges, and the Atlantic Ocean touches the island\'s right and bottom edges. The island is partitioned into a grid of square cells. You are given an m x n integer matrix heights where heights[r][c] represents the height above sea level of the cell at coordinate (r, c). The island receives a lot of rain, and the rain water can flow to neighboring cells directly north, south, east, and west if the neighboring cell\'s height is less than or equal to the current cell\'s height. Water can flow from any cell adjacent to an ocean into the ocean. Return a 2D list of grid coordinates result where result[i] = [ri, ci] denotes that rain water can flow from cell (ri, ci) to both the Pacific and Atlantic oceans.',
        constraints: 'm == heights.length\nn == heights[r].length\n1 <= m, n <= 200\n0 <= heights[r][c] <= 10^5',
        examples: [{input: 'heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]', output: '[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]'}],
        tags: ['Array', 'DFS', 'BFS', 'Matrix'],
        starterCode: {
            javascript: `function pacificAtlantic(heights) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(pacificAtlantic([[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]));`,
            python: `def pacific_atlantic(heights):\n    # Write your code here\n    pass\n\n# Test\nprint(pacific_atlantic([[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]))`,
            java: `class Solution {\n    public List<List<Integer>> pacificAtlantic(int[][] heights) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}`
        },
        timeLimit: 30
    },
    '207': {
        id: 207,
        title: 'Course Schedule',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. For example, the pair [0, 1], indicates that to take course 0 you have to first take course 1. Return true if you can finish all courses. Otherwise, return false.',
        constraints: '1 <= numCourses <= 2000\n0 <= prerequisites.length <= 5000\nprerequisites[i].length == 2\n0 <= ai, bi < numCourses\nAll the pairs prerequisites[i] are unique.',
        examples: [{input: 'numCourses = 2, prerequisites = [[1,0]]', output: 'true'},{input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]', output: 'false'}],
        tags: ['DFS', 'BFS', 'Graph', 'Topological Sort'],
        starterCode: {
            javascript: `function canFinish(numCourses, prerequisites) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(canFinish(2, [[1,0]]));`,
            python: `def can_finish(num_courses, prerequisites):\n    # Write your code here\n    pass\n\n# Test\nprint(can_finish(2, [[1,0]]))`,
            java: `class Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        // Write your code here\n        return false;\n    }\n}`
        },
        timeLimit: 30
    },
    '150': {
        id: 150,
        title: 'Evaluate Reverse Polish Notation',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'You are given an array of strings tokens that represents an arithmetic expression in a Reverse Polish Notation. Evaluate the expression. Return an integer that represents the value of the expression.',
        constraints: '1 <= tokens.length <= 10^4\ntokens[i] is either an operator: "+", "-", "*", or "/", or an integer in the range [-200, 200].',
        examples: [{input: 'tokens = ["2","1","+","3","*"]', output: '9', explanation: '((2 + 1) * 3) = 9'}],
        tags: ['Array', 'Math', 'Stack'],
        starterCode: {
            javascript: `function evalRPN(tokens) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(evalRPN(["2","1","+","3","*"]));`,
            python: `def eval_rpn(tokens):\n    # Write your code here\n    pass\n\n# Test\nprint(eval_rpn(["2","1","+","3","*"]))`,
            java: `class Solution {\n    public int evalRPN(String[] tokens) {\n        // Write your code here\n        return 0;\n    }\n}`
        },
        timeLimit: 30
    },
    '22': {
        id: 22,
        title: 'Generate Parentheses',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.',
        constraints: '1 <= n <= 8',
        examples: [{input: 'n = 3', output: '["((()))","(()())","(())()","()(())","()()()"]'}],
        tags: ['String', 'Dynamic Programming', 'Backtracking'],
        starterCode: {
            javascript: `function generateParenthesis(n) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(generateParenthesis(3));`,
            python: `def generate_parenthesis(n):\n    # Write your code here\n    pass\n\n# Test\nprint(generate_parenthesis(3))`,
            java: `class Solution {\n    public List<String> generateParenthesis(int n) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}`
        },
        timeLimit: 30
    },
    '84': {
        id: 84,
        title: 'Largest Rectangle in Histogram',
        difficulty: 'Hard',
        category: 'DSA',
        description: 'Given an array of integers heights representing the histogram\'s bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.',
        constraints: '1 <= heights.length <= 10^5\n0 <= heights[i] <= 10^4',
        examples: [{input: 'heights = [2,1,5,6,2,3]', output: '10'}],
        tags: ['Array', 'Stack', 'Monotonic Stack'],
        starterCode: {
            javascript: `function largestRectangleArea(heights) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(largestRectangleArea([2,1,5,6,2,3]));`,
            python: `def largest_rectangle_area(heights):\n    # Write your code here\n    pass\n\n# Test\nprint(largest_rectangle_area([2,1,5,6,2,3]))`,
            java: `class Solution {\n    public int largestRectangleArea(int[] heights) {\n        // Write your code here\n        return 0;\n    }\n}`
        },
        timeLimit: 30
    },
    '33': {
        id: 33,
        title: 'Search in Rotated Sorted Array',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k. For example, [0,1,2,4,5,6,7] might be rotated at pivot index 3 and become [4,5,6,7,0,1,2]. Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums. You must write an algorithm with O(log n) runtime complexity.',
        constraints: '1 <= nums.length <= 5000\n-10^4 <= nums[i] <= 10^4\nAll values of nums are unique.\nnums is an ascending array that is possibly rotated.\n-10^4 <= target <= 10^4',
        examples: [{input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4'}],
        tags: ['Array', 'Binary Search'],
        starterCode: {
            javascript: `function search(nums, target) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(search([4,5,6,7,0,1,2], 0));`,
            python: `def search(nums, target):\n    # Write your code here\n    pass\n\n# Test\nprint(search([4,5,6,7,0,1,2], 0))`,
            java: `class Solution {\n    public int search(int[] nums, int target) {\n        // Write your code here\n        return -1;\n    }\n}`
        },
        timeLimit: 30
    },
    '4': {
        id: 4,
        title: 'Median of Two Sorted Arrays',
        difficulty: 'Hard',
        category: 'DSA',
        description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).',
        constraints: 'nums1.length == m\nnums2.length == n\n0 <= m <= 1000\n0 <= n <= 1000\n1 <= m + n <= 2000\n-10^6 <= nums1[i], nums2[i] <= 10^6',
        examples: [{input: 'nums1 = [1,3], nums2 = [2]', output: '2.00000'}],
        tags: ['Array', 'Binary Search', 'Divide and Conquer'],
        starterCode: {
            javascript: `function findMedianSortedArrays(nums1, nums2) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(findMedianSortedArrays([1,3], [2]));`,
            python: `def find_median_sorted_arrays(nums1, nums2):\n    # Write your code here\n    pass\n\n# Test\nprint(find_median_sorted_arrays([1,3], [2]))`,
            java: `class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Write your code here\n        return 0.0;\n    }\n}`
        },
        timeLimit: 30
    },
    '143': {
        id: 143,
        title: 'Reorder List',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'You are given the head of a singly linked-list. The list can be represented as: L0 → L1 → … → Ln - 1 → Ln. Reorder the list to be on the following form: L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …',
        constraints: 'The number of nodes in the list is in the range [1, 5 * 10^4].\n1 <= Node.val <= 1000',
        examples: [{input: 'head = [1,2,3,4]', output: '[1,4,2,3]'}],
        tags: ['Linked List', 'Two Pointers', 'Stack', 'Recursion'],
        starterCode: {
            javascript: `function reorderList(head) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(reorderList([1,2,3,4]));`,
            python: `def reorder_list(head):\n    # Write your code here\n    pass\n\n# Test\nprint(reorder_list([1,2,3,4]))`,
            java: `class Solution {\n    public void reorderList(ListNode head) {\n        // Write your code here\n    }\n}`
        },
        timeLimit: 30
    },
    '19': {
        id: 19,
        title: 'Remove Nth Node From End of List',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'Given the head of a linked list, remove the nth node from the end of the list and return its head.',
        constraints: 'The number of nodes in the list is sz.\n1 <= sz <= 30\n0 <= Node.val <= 100\n1 <= n <= sz',
        examples: [{input: 'head = [1,2,3,4,5], n = 2', output: '[1,2,3,5]'}],
        tags: ['Linked List', 'Two Pointers'],
        starterCode: {
            javascript: `function removeNthFromEnd(head, n) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(removeNthFromEnd([1,2,3,4,5], 2));`,
            python: `def remove_nth_from_end(head, n):\n    # Write your code here\n    pass\n\n# Test\nprint(remove_nth_from_end([1,2,3,4,5], 2))`,
            java: `class Solution {\n    public ListNode removeNthFromEnd(ListNode head, int n) {\n        // Write your code here\n        return null;\n    }\n}`
        },
        timeLimit: 30
    },
    '23': {
        id: 23,
        title: 'Merge K Sorted Lists',
        difficulty: 'Hard',
        category: 'DSA',
        description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
        constraints: 'k == lists.length\n0 <= k <= 10^4\n0 <= lists[i].length <= 500\n-10^4 <= lists[i][j] <= 10^4\nlists[i] is sorted in ascending order.',
        examples: [{input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]'}],
        tags: ['Linked List', 'Divide and Conquer', 'Heap', 'Merge Sort'],
        starterCode: {
            javascript: `function mergeKLists(lists) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(mergeKLists([[1,4,5],[1,3,4],[2,6]]));`,
            python: `def merge_k_lists(lists):\n    # Write your code here\n    pass\n\n# Test\nprint(merge_k_lists([[1,4,5],[1,3,4],[2,6]]))`,
            java: `class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        // Write your code here\n        return null;\n    }\n}`
        },
        timeLimit: 30
    },
    '102': {
        id: 102,
        title: 'Binary Tree Level Order Traversal',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'Given the root of a binary tree, return the level order traversal of its nodes\' values. (i.e., from left to right, level by level).',
        constraints: 'The number of nodes in the tree is in the range [0, 2000].\n-1000 <= Node.val <= 1000',
        examples: [{input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]'}],
        tags: ['Tree', 'BFS', 'Binary Tree'],
        starterCode: {
            javascript: `function levelOrder(root) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(levelOrder([3,9,20,null,null,15,7]));`,
            python: `def level_order(root):\n    # Write your code here\n    pass\n\n# Test\nprint(level_order([3,9,20,None,None,15,7]))`,
            java: `class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}`
        },
        timeLimit: 30
    },
    '105': {
        id: 105,
        title: 'Construct Binary Tree from Preorder and Inorder',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree.',
        constraints: '1 <= preorder.length <= 3000\ninorder.length == preorder.length\n-3000 <= preorder[i], inorder[i] <= 3000\npreorder and inorder consist of unique values.',
        examples: [{input: 'preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]', output: '[3,9,20,null,null,15,7]'}],
        tags: ['Array', 'Hash Table', 'Divide and Conquer', 'Tree', 'Binary Tree'],
        starterCode: {
            javascript: `function buildTree(preorder, inorder) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(buildTree([3,9,20,15,7], [9,3,15,20,7]));`,
            python: `def build_tree(preorder, inorder):\n    # Write your code here\n    pass\n\n# Test\nprint(build_tree([3,9,20,15,7], [9,3,15,20,7]))`,
            java: `class Solution {\n    public TreeNode buildTree(int[] preorder, int[] inorder) {\n        // Write your code here\n        return null;\n    }\n}`
        },
        timeLimit: 30
    },
    '98': {
        id: 98,
        title: 'Validate Binary Search Tree',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'Given the root of a binary tree, determine if it is a valid binary search tree (BST).',
        constraints: 'The number of nodes in the tree is in the range [1, 10^4].\n-2^31 <= Node.val <= 2^31 - 1',
        examples: [{input: 'root = [2,1,3]', output: 'true'}],
        tags: ['Tree', 'DFS', 'Binary Search Tree', 'Binary Tree'],
        starterCode: {
            javascript: `function isValidBST(root) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(isValidBST([2,1,3]));`,
            python: `def is_valid_bst(root):\n    # Write your code here\n    pass\n\n# Test\nprint(is_valid_bst([2,1,3]))`,
            java: `class Solution {\n    public boolean isValidBST(TreeNode root) {\n        // Write your code here\n        return false;\n    }\n}`
        },
        timeLimit: 30
    },
    '124': {
        id: 124,
        title: 'Binary Tree Maximum Path Sum',
        difficulty: 'Hard',
        category: 'DSA',
        description: 'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root. The path sum of a path is the sum of the node\'s values in the path. Given the root of a binary tree, return the maximum path sum of any non-empty path.',
        constraints: 'The number of nodes in the tree is in the range [1, 3 * 10^4].\n-1000 <= Node.val <= 1000',
        examples: [{input: 'root = [1,2,3]', output: '6'}],
        tags: ['Dynamic Programming', 'Tree', 'DFS', 'Binary Tree'],
        starterCode: {
            javascript: `function maxPathSum(root) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(maxPathSum([1,2,3]));`,
            python: `def max_path_sum(root):\n    # Write your code here\n    pass\n\n# Test\nprint(max_path_sum([1,2,3]))`,
            java: `class Solution {\n    public int maxPathSum(TreeNode root) {\n        // Write your code here\n        return 0;\n    }\n}`
        },
        timeLimit: 30
    },
    '297': {
        id: 297,
        title: 'Serialize and Deserialize Binary Tree',
        difficulty: 'Hard',
        category: 'DSA',
        description: 'Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment. Design an algorithm to serialize and deserialize a binary tree.',
        constraints: 'The number of nodes in the tree is in the range [0, 10^4].\n-1000 <= Node.val <= 1000',
        examples: [{input: 'root = [1,2,3,null,null,4,5]', output: '[1,2,3,null,null,4,5]'}],
        tags: ['String', 'Tree', 'DFS', 'BFS', 'Design', 'Binary Tree'],
        starterCode: {
            javascript: `function serialize(root) {\n    // Write your code here\n    \n}\n\nfunction deserialize(data) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(deserialize(serialize([1,2,3,null,null,4,5])));`,
            python: `def serialize(root):\n    # Write your code here\n    pass\n\ndef deserialize(data):\n    # Write your code here\n    pass\n\n# Test\nprint(deserialize(serialize([1,2,3,None,None,4,5])))`,
            java: `class Codec {\n    public String serialize(TreeNode root) {\n        // Write your code here\n        return "";\n    }\n    \n    public TreeNode deserialize(String data) {\n        // Write your code here\n        return null;\n    }\n}`
        },
        timeLimit: 30
    },
    '703': {
        id: 703,
        title: 'Kth Largest Element in a Stream',
        difficulty: 'Easy',
        category: 'DSA',
        description: 'Design a class to find the kth largest element in a stream. Note that it is the kth largest element in the sorted order, not the kth distinct element.',
        constraints: '1 <= k <= 10^4\n0 <= nums.length <= 10^4\n-10^4 <= nums[i] <= 10^4\n-10^4 <= val <= 10^4',
        examples: [{input: '["KthLargest", "add", "add", "add", "add", "add"]\\n[[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]]', output: '[null, 4, 5, 5, 8, 8]'}],
        tags: ['Tree', 'Design', 'Binary Search Tree', 'Heap', 'Binary Tree', 'Data Stream'],
        starterCode: {
            javascript: `class KthLargest {\n    constructor(k, nums) {\n        // Write your code here\n    }\n    \n    add(val) {\n        // Write your code here\n    }\n}\n\n// Test\nconst kthLargest = new KthLargest(3, [4, 5, 8, 2]);\nconsole.log(kthLargest.add(3));`,
            python: `class KthLargest:\n    def __init__(self, k, nums):\n        # Write your code here\n        pass\n    \n    def add(self, val):\n        # Write your code here\n        pass\n\n# Test\nkth_largest = KthLargest(3, [4, 5, 8, 2])\nprint(kth_largest.add(3))`,
            java: `class KthLargest {\n    public KthLargest(int k, int[] nums) {\n        // Write your code here\n    }\n    \n    public int add(int val) {\n        // Write your code here\n        return 0;\n    }\n}`
        },
        timeLimit: 30
    },
    '215': {
        id: 215,
        title: 'Kth Largest Element in an Array',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'Given an integer array nums and an integer k, return the kth largest element in the array. Note that it is the kth largest element in the sorted order, not the kth distinct element.',
        constraints: '1 <= k <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4',
        examples: [{input: 'nums = [3,2,1,5,6,4], k = 2', output: '5'}],
        tags: ['Array', 'Divide and Conquer', 'Sorting', 'Heap', 'Quickselect'],
        starterCode: {
            javascript: `function findKthLargest(nums, k) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(findKthLargest([3,2,1,5,6,4], 2));`,
            python: `def find_kth_largest(nums, k):\n    # Write your code here\n    pass\n\n# Test\nprint(find_kth_largest([3,2,1,5,6,4], 2))`,
            java: `class Solution {\n    public int findKthLargest(int[] nums, int k) {\n        // Write your code here\n        return 0;\n    }\n}`
        },
        timeLimit: 30
    },
    '295': {
        id: 295,
        title: 'Find Median from Data Stream',
        difficulty: 'Hard',
        category: 'DSA',
        description: 'The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values. Implement the MedianFinder class.',
        constraints: '-10^5 <= num <= 10^5',
        examples: [{input: '["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]\\n[[], [1], [2], [], [3], []]', output: '[null, null, null, 1.5, null, 2.0]'}],
        tags: ['Two Pointers', 'Design', 'Sorting', 'Heap', 'Data Stream'],
        starterCode: {
            javascript: `class MedianFinder {\n    constructor() {\n        // Write your code here\n    }\n    \n    addNum(num) {\n        // Write your code here\n    }\n    \n    findMedian() {\n        // Write your code here\n    }\n}\n\n// Test\nconst mf = new MedianFinder();\nmf.addNum(1);\nmf.addNum(2);\nconsole.log(mf.findMedian());`,
            python: `class MedianFinder:\n    def __init__(self):\n        # Write your code here\n        pass\n    \n    def add_num(self, num):\n        # Write your code here\n        pass\n    \n    def find_median(self):\n        # Write your code here\n        pass\n\n# Test\nmf = MedianFinder()\nmf.add_num(1)\nmf.add_num(2)\nprint(mf.find_median())`,
            java: `class MedianFinder {\n    public MedianFinder() {\n        // Write your code here\n    }\n    \n    public void addNum(int num) {\n        // Write your code here\n    }\n    \n    public double findMedian() {\n        // Write your code here\n        return 0.0;\n    }\n}`
        },
        timeLimit: 30
    },
    '39': {
        id: 39,
        title: 'Combination Sum',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order. The same number may be chosen from candidates an unlimited number of times.',
        constraints: '1 <= candidates.length <= 30\n2 <= candidates[i] <= 40\nAll elements of candidates are distinct.\n1 <= target <= 40',
        examples: [{input: 'candidates = [2,3,6,7], target = 7', output: '[[2,2,3],[7]]'}],
        tags: ['Array', 'Backtracking'],
        starterCode: {
            javascript: `function combinationSum(candidates, target) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(combinationSum([2,3,6,7], 7));`,
            python: `def combination_sum(candidates, target):\n    # Write your code here\n    pass\n\n# Test\nprint(combination_sum([2,3,6,7], 7))`,
            java: `class Solution {\n    public List<List<Integer>> combinationSum(int[] candidates, int target) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}`
        },
        timeLimit: 30
    },
    '79': {
        id: 79,
        title: 'Word Search',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring.',
        constraints: 'm == board.length\nn = board[i].length\n1 <= m, n <= 6\n1 <= word.length <= 15\nboard and word consists of only lowercase and uppercase English letters.',
        examples: [{input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: 'true'}],
        tags: ['Array', 'Backtracking', 'Matrix'],
        starterCode: {
            javascript: `function exist(board, word) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED"));`,
            python: `def exist(board, word):\n    # Write your code here\n    pass\n\n# Test\nprint(exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED"))`,
            java: `class Solution {\n    public boolean exist(char[][] board, String word) {\n        // Write your code here\n        return false;\n    }\n}`
        },
        timeLimit: 30
    },
    '51': {
        id: 51,
        title: 'N-Queens',
        difficulty: 'Hard',
        category: 'DSA',
        description: 'The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return all distinct solutions to the n-queens puzzle.',
        constraints: '1 <= n <= 9',
        examples: [{input: 'n = 4', output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]'}],
        tags: ['Array', 'Backtracking'],
        starterCode: {
            javascript: `function solveNQueens(n) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(solveNQueens(4));`,
            python: `def solve_n_queens(n):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_n_queens(4))`,
            java: `class Solution {\n    public List<List<String>> solveNQueens(int n) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}`
        },
        timeLimit: 30
    },
    '208': {
        id: 208,
        title: 'Implement Trie (Prefix Tree)',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'A trie (pronounced as "try") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this data structure, such as autocomplete and spellchecker. Implement the Trie class.',
        constraints: '1 <= word.length, prefix.length <= 2000\nword and prefix consist only of lowercase English letters.',
        examples: [{input: '["Trie", "insert", "search", "search", "startsWith", "insert", "search"]\\n[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]', output: '[null, null, true, false, true, null, true]'}],
        tags: ['Hash Table', 'String', 'Design', 'Trie'],
        starterCode: {
            javascript: `class Trie {\n    constructor() {\n        // Write your code here\n    }\n    \n    insert(word) {\n        // Write your code here\n    }\n    \n    search(word) {\n        // Write your code here\n    }\n    \n    startsWith(prefix) {\n        // Write your code here\n    }\n}\n\n// Test\nconst trie = new Trie();\ntrie.insert("apple");\nconsole.log(trie.search("apple"));`,
            python: `class Trie:\n    def __init__(self):\n        # Write your code here\n        pass\n    \n    def insert(self, word):\n        # Write your code here\n        pass\n    \n    def search(self, word):\n        # Write your code here\n        pass\n    \n    def starts_with(self, prefix):\n        # Write your code here\n        pass\n\n# Test\ntrie = Trie()\ntrie.insert("apple")\nprint(trie.search("apple"))`,
            java: `class Trie {\n    public Trie() {\n        // Write your code here\n    }\n    \n    public void insert(String word) {\n        // Write your code here\n    }\n    \n    public boolean search(String word) {\n        // Write your code here\n        return false;\n    }\n    \n    public boolean startsWith(String prefix) {\n        // Write your code here\n        return false;\n    }\n}`
        },
        timeLimit: 30
    },
    '211': {
        id: 211,
        title: 'Design Add and Search Words Data Structure',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'Design a data structure that supports adding new words and finding if a string matches any previously added string. Implement the WordDictionary class.',
        constraints: '1 <= word.length <= 25\nword in addWord consists of lowercase English letters.\nword in search consist of \'.\' or lowercase English letters.',
        examples: [{input: '["WordDictionary","addWord","addWord","addWord","search","search","search","search"]\\n[[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]]', output: '[null,null,null,null,false,true,true,true]'}],
        tags: ['String', 'DFS', 'Design', 'Trie'],
        starterCode: {
            javascript: `class WordDictionary {\n    constructor() {\n        // Write your code here\n    }\n    \n    addWord(word) {\n        // Write your code here\n    }\n    \n    search(word) {\n        // Write your code here\n    }\n}\n\n// Test\nconst wd = new WordDictionary();\nwd.addWord("bad");\nconsole.log(wd.search("bad"));`,
            python: `class WordDictionary:\n    def __init__(self):\n        # Write your code here\n        pass\n    \n    def add_word(self, word):\n        # Write your code here\n        pass\n    \n    def search(self, word):\n        # Write your code here\n        pass\n\n# Test\nwd = WordDictionary()\nwd.add_word("bad")\nprint(wd.search("bad"))`,
            java: `class WordDictionary {\n    public WordDictionary() {\n        // Write your code here\n    }\n    \n    public void addWord(String word) {\n        // Write your code here\n    }\n    \n    public boolean search(String word) {\n        // Write your code here\n        return false;\n    }\n}`
        },
        timeLimit: 30
    },
    '212': {
        id: 212,
        title: 'Word Search II',
        difficulty: 'Hard',
        category: 'DSA',
        description: 'Given an m x n board of characters and a list of strings words, return all words on the board. Each word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring.',
        constraints: 'm == board.length\nn == board[i].length\n1 <= m, n <= 12\nboard[i][j] is a lowercase English letter.\n1 <= words.length <= 3 * 10^4\n1 <= words[i].length <= 10\nwords[i] consists of lowercase English letters.',
        examples: [{input: 'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]', output: '["eat","oath"]'}],
        tags: ['Array', 'String', 'Backtracking', 'Trie', 'Matrix'],
        starterCode: {
            javascript: `function findWords(board, words) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(findWords([["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], ["oath","pea","eat","rain"]));`,
            python: `def find_words(board, words):\n    # Write your code here\n    pass\n\n# Test\nprint(find_words([["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], ["oath","pea","eat","rain"]))`,
            java: `class Solution {\n    public List<String> findWords(char[][] board, String[] words) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}`
        },
        timeLimit: 30
    },
    '70': {
        id: 70,
        title: 'Climbing Stairs',
        difficulty: 'Easy',
        category: 'DSA',
        description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
        constraints: '1 <= n <= 45',
        examples: [{input: 'n = 2', output: '2'},{input: 'n = 3', output: '3'}],
        tags: ['Math', 'Dynamic Programming', 'Memoization'],
        starterCode: {
            javascript: `function climbStairs(n) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(climbStairs(3));`,
            python: `def climb_stairs(n):\n    # Write your code here\n    pass\n\n# Test\nprint(climb_stairs(3))`,
            java: `class Solution {\n    public int climbStairs(int n) {\n        // Write your code here\n        return 0;\n    }\n}`
        },
        timeLimit: 30
    },
    '198': {
        id: 198,
        title: 'House Robber',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night. Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.',
        constraints: '1 <= nums.length <= 100\n0 <= nums[i] <= 400',
        examples: [{input: 'nums = [1,2,3,1]', output: '4'}],
        tags: ['Array', 'Dynamic Programming'],
        starterCode: {
            javascript: `function rob(nums) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(rob([1,2,3,1]));`,
            python: `def rob(nums):\n    # Write your code here\n    pass\n\n# Test\nprint(rob([1,2,3,1]))`,
            java: `class Solution {\n    public int rob(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}`
        },
        timeLimit: 30
    },
    '322': {
        id: 322,
        title: 'Coin Change',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.',
        constraints: '1 <= coins.length <= 12\n1 <= coins[i] <= 2^31 - 1\n0 <= amount <= 10^4',
        examples: [{input: 'coins = [1,2,5], amount = 11', output: '3'}],
        tags: ['Array', 'Dynamic Programming', 'BFS'],
        starterCode: {
            javascript: `function coinChange(coins, amount) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(coinChange([1,2,5], 11));`,
            python: `def coin_change(coins, amount):\n    # Write your code here\n    pass\n\n# Test\nprint(coin_change([1,2,5], 11))`,
            java: `class Solution {\n    public int coinChange(int[] coins, int amount) {\n        // Write your code here\n        return 0;\n    }\n}`
        },
        timeLimit: 30
    },
    '300': {
        id: 300,
        title: 'Longest Increasing Subsequence',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'Given an integer array nums, return the length of the longest strictly increasing subsequence.',
        constraints: '1 <= nums.length <= 2500\n-10^4 <= nums[i] <= 10^4',
        examples: [{input: 'nums = [10,9,2,5,3,7,101,18]', output: '4'}],
        tags: ['Array', 'Binary Search', 'Dynamic Programming'],
        starterCode: {
            javascript: `function lengthOfLIS(nums) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(lengthOfLIS([10,9,2,5,3,7,101,18]));`,
            python: `def length_of_lis(nums):\n    # Write your code here\n    pass\n\n# Test\nprint(length_of_lis([10,9,2,5,3,7,101,18]))`,
            java: `class Solution {\n    public int lengthOfLIS(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}`
        },
        timeLimit: 30
    },
    '72': {
        id: 72,
        title: 'Edit Distance',
        difficulty: 'Hard',
        category: 'DSA',
        description: 'Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. You have the following three operations permitted on a word: Insert a character, Delete a character, Replace a character.',
        constraints: '0 <= word1.length, word2.length <= 500\nword1 and word2 consist of lowercase English letters.',
        examples: [{input: 'word1 = "horse", word2 = "ros"', output: '3'}],
        tags: ['String', 'Dynamic Programming'],
        starterCode: {
            javascript: `function minDistance(word1, word2) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(minDistance("horse", "ros"));`,
            python: `def min_distance(word1, word2):\n    # Write your code here\n    pass\n\n# Test\nprint(min_distance("horse", "ros"))`,
            java: `class Solution {\n    public int minDistance(String word1, String word2) {\n        // Write your code here\n        return 0;\n    }\n}`
        },
        timeLimit: 30
    },
    '121': {
        id: 121,
        title: 'Best Time to Buy and Sell Stock',
        difficulty: 'Easy',
        category: 'DSA',
        description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.',
        constraints: '1 <= prices.length <= 10^5\n0 <= prices[i] <= 10^4',
        examples: [{input: 'prices = [7,1,5,3,6,4]', output: '5'}],
        tags: ['Array', 'Dynamic Programming'],
        starterCode: {
            javascript: `function maxProfit(prices) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(maxProfit([7,1,5,3,6,4]));`,
            python: `def max_profit(prices):\n    # Write your code here\n    pass\n\n# Test\nprint(max_profit([7,1,5,3,6,4]))`,
            java: `class Solution {\n    public int maxProfit(int[] prices) {\n        // Write your code here\n        return 0;\n    }\n}`
        },
        timeLimit: 30
    },
    '55': {
        id: 55,
        title: 'Jump Game',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'You are given an integer array nums. You are initially positioned at the array\'s first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index, or false otherwise.',
        constraints: '1 <= nums.length <= 10^4\n0 <= nums[i] <= 10^5',
        examples: [{input: 'nums = [2,3,1,1,4]', output: 'true'}],
        tags: ['Array', 'Dynamic Programming', 'Greedy'],
        starterCode: {
            javascript: `function canJump(nums) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(canJump([2,3,1,1,4]));`,
            python: `def can_jump(nums):\n    # Write your code here\n    pass\n\n# Test\nprint(can_jump([2,3,1,1,4]))`,
            java: `class Solution {\n    public boolean canJump(int[] nums) {\n        // Write your code here\n        return false;\n    }\n}`
        },
        timeLimit: 30
    },
    '45': {
        id: 45,
        title: 'Jump Game II',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'You are given a 0-indexed array of integers nums of length n. You are initially positioned at nums[0]. Each element nums[i] represents the maximum length of a forward jump from index i. In other words, if you are at nums[i], you can jump to any nums[i + j] where: 0 <= j <= nums[i] and i + j < n. Return the minimum number of jumps to reach nums[n - 1].',
        constraints: '1 <= nums.length <= 10^4\n0 <= nums[i] <= 1000',
        examples: [{input: 'nums = [2,3,1,1,4]', output: '2'}],
        tags: ['Array', 'Dynamic Programming', 'Greedy'],
        starterCode: {
            javascript: `function jump(nums) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(jump([2,3,1,1,4]));`,
            python: `def jump(nums):\n    # Write your code here\n    pass\n\n# Test\nprint(jump([2,3,1,1,4]))`,
            java: `class Solution {\n    public int jump(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}`
        },
        timeLimit: 30
    },
    '57': {
        id: 57,
        title: 'Insert Interval',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'You are given an array of non-overlapping intervals intervals where intervals[i] = [starti, endi] represent the start and the end of the ith interval and intervals is sorted in ascending order by starti. You are also given an interval newInterval = [start, end] that represents the start and end of another interval. Insert newInterval into intervals such that intervals is still sorted in ascending order by starti and intervals still does not have any overlapping intervals (merge overlapping intervals if necessary). Return intervals after the insertion.',
        constraints: '0 <= intervals.length <= 10^4\nintervals[i].length == 2\n0 <= starti <= endi <= 10^5\nnewInterval.length == 2\n0 <= start <= end <= 10^5',
        examples: [{input: 'intervals = [[1,3],[6,9]], newInterval = [2,5]', output: '[[1,5],[6,9]]'}],
        tags: ['Array'],
        starterCode: {
            javascript: `function insert(intervals, newInterval) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(insert([[1,3],[6,9]], [2,5]));`,
            python: `def insert(intervals, new_interval):\n    # Write your code here\n    pass\n\n# Test\nprint(insert([[1,3],[6,9]], [2,5]))`,
            java: `class Solution {\n    public int[][] insert(int[][] intervals, int[] newInterval) {\n        // Write your code here\n        return new int[][]{};\n    }\n}`
        },
        timeLimit: 30
    },
    '56': {
        id: 56,
        title: 'Merge Intervals',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
        constraints: '1 <= intervals.length <= 10^4\nintervals[i].length == 2\n0 <= starti <= endi <= 10^4',
        examples: [{input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]'}],
        tags: ['Array', 'Sorting'],
        starterCode: {
            javascript: `function merge(intervals) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(merge([[1,3],[2,6],[8,10],[15,18]]));`,
            python: `def merge(intervals):\n    # Write your code here\n    pass\n\n# Test\nprint(merge([[1,3],[2,6],[8,10],[15,18]]))`,
            java: `class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Write your code here\n        return new int[][]{};\n    }\n}`
        },
        timeLimit: 30
    },
    '435': {
        id: 435,
        title: 'Non-overlapping Intervals',
        difficulty: 'Medium',
        category: 'DSA',
        description: 'Given an array of intervals intervals where intervals[i] = [starti, endi], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.',
        constraints: '1 <= intervals.length <= 10^5\nintervals[i].length == 2\n-5 * 10^4 <= starti < endi <= 5 * 10^4',
        examples: [{input: 'intervals = [[1,2],[2,3],[3,4],[1,3]]', output: '1'}],
        tags: ['Array', 'Dynamic Programming', 'Greedy', 'Sorting'],
        starterCode: {
            javascript: `function eraseOverlapIntervals(intervals) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(eraseOverlapIntervals([[1,2],[2,3],[3,4],[1,3]]));`,
            python: `def erase_overlap_intervals(intervals):\n    # Write your code here\n    pass\n\n# Test\nprint(erase_overlap_intervals([[1,2],[2,3],[3,4],[1,3]]))`,
            java: `class Solution {\n    public int eraseOverlapIntervals(int[][] intervals) {\n        // Write your code here\n        return 0;\n    }\n}`
        },
        timeLimit: 30
    },
    '572': {
        id: 572,
        title: 'Subtree of Another Tree',
        difficulty: 'Easy',
        category: 'DSA',
        description: 'Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and node values of subRoot and false otherwise. A subtree of a binary tree tree is a tree that consists of a node in tree and all of this node\'s descendants.',
        constraints: 'The number of nodes in the root tree is in the range [1, 2000].\nThe number of nodes in the subRoot tree is in the range [1, 1000].\n-10^4 <= root.val <= 10^4\n-10^4 <= subRoot.val <= 10^4',
        examples: [{input: 'root = [3,4,5,1,2], subRoot = [4,1,2]', output: 'true'}],
        tags: ['Tree', 'DFS', 'Binary Tree', 'String Matching', 'Hash Function'],
        starterCode: {
            javascript: `function isSubtree(root, subRoot) {\n    // Write your code here\n    \n}\n\n// Test\nconsole.log(isSubtree([3,4,5,1,2], [4,1,2]));`,
            python: `def is_subtree(root, subRoot):\n    # Write your code here\n    pass\n\n# Test\nprint(is_subtree([3,4,5,1,2], [4,1,2]))`,
            java: `class Solution {\n    public boolean isSubtree(TreeNode root, TreeNode subRoot) {\n        // Write your code here\n        return false;\n    }\n}`
        },
        timeLimit: 30
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = questionsBank;
}
