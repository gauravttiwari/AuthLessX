const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('./models/Question');

dotenv.config();

// Sample DSA Questions
const dsaQuestions = [
    {
        questionId: 'DSA001',
        type: 'DSA',
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.',
        difficulty: 'Easy',
        timeLimit: 20,
        constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
        examples: [
            {
                input: 'nums = [2,7,11,15], target = 9',
                output: '[0,1]',
                explanation: 'nums[0] + nums[1] = 2 + 7 = 9'
            }
        ],
        tags: ['Array', 'Hash Table'],
        testCases: [
            { input: '2,7,11,15|9', expectedOutput: '0,1', isHidden: false },
            { input: '3,2,4|6', expectedOutput: '1,2', isHidden: false },
            { input: '3,3|6', expectedOutput: '0,1', isHidden: true }
        ],
        starterCode: {
            python: 'def two_sum(nums, target):\n    # Your code here\n    pass\n\n# Test\nnums = list(map(int, input().split(",")))\ntarget = int(input())\nresult = two_sum(nums, target)\nprint(",".join(map(str, result)))',
            javascript: 'function twoSum(nums, target) {\n    // Your code here\n}\n\n// Test\nconst input = require("fs").readFileSync(0, "utf-8").trim().split("\\n");\nconst nums = input[0].split(",").map(Number);\nconst target = Number(input[1]);\nconst result = twoSum(nums, target);\nconsole.log(result.join(","));',
            java: 'import java.util.*;\n\npublic class Solution {\n    public static int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[]{};\n    }\n    \n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String[] numsStr = sc.nextLine().split(",");\n        int[] nums = Arrays.stream(numsStr).mapToInt(Integer::parseInt).toArray();\n        int target = sc.nextInt();\n        int[] result = twoSum(nums, target);\n        System.out.println(result[0] + "," + result[1]);\n    }\n}',
            cpp: '#include <iostream>\n#include <vector>\n#include <sstream>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n    return {};\n}\n\nint main() {\n    string line;\n    getline(cin, line);\n    vector<int> nums;\n    stringstream ss(line);\n    string num;\n    while(getline(ss, num, \',\')) {\n        nums.push_back(stoi(num));\n    }\n    int target;\n    cin >> target;\n    vector<int> result = twoSum(nums, target);\n    cout << result[0] << "," << result[1];\n    return 0;\n}',
            c: '#include <stdio.h>\n#include <stdlib.h>\n\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Your code here\n    *returnSize = 2;\n    int* result = (int*)malloc(2 * sizeof(int));\n    return result;\n}\n\nint main() {\n    // Implementation needed\n    return 0;\n}'
        }
    },
    {
        questionId: 'DSA002',
        type: 'DSA',
        title: 'Reverse a String',
        description: 'Write a function that reverses a string. The input string is given as an array of characters.',
        difficulty: 'Easy',
        timeLimit: 15,
        constraints: '1 <= s.length <= 10^5\ns[i] is a printable ascii character',
        examples: [
            {
                input: 's = ["h","e","l","l","o"]',
                output: '["o","l","l","e","h"]',
                explanation: 'Simply reverse the array of characters'
            }
        ],
        tags: ['String', 'Two Pointers'],
        testCases: [
            { input: 'hello', expectedOutput: 'olleh', isHidden: false },
            { input: 'world', expectedOutput: 'dlrow', isHidden: false },
            { input: 'a', expectedOutput: 'a', isHidden: true }
        ],
        starterCode: {
            python: 'def reverse_string(s):\n    # Your code here\n    return s[::-1]\n\n# Test\ns = input().strip()\nprint(reverse_string(s))',
            javascript: 'function reverseString(s) {\n    // Your code here\n    return s.split("").reverse().join("");\n}\n\n// Test\nconst s = require("fs").readFileSync(0, "utf-8").trim();\nconsole.log(reverseString(s));',
            java: 'import java.util.*;\n\npublic class Solution {\n    public static String reverseString(String s) {\n        // Your code here\n        return new StringBuilder(s).reverse().toString();\n    }\n    \n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        System.out.println(reverseString(s));\n    }\n}',
            cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nstring reverseString(string s) {\n    // Your code here\n    reverse(s.begin(), s.end());\n    return s;\n}\n\nint main() {\n    string s;\n    getline(cin, s);\n    cout << reverseString(s);\n    return 0;\n}',
            c: '#include <stdio.h>\n#include <string.h>\n\nvoid reverseString(char* s) {\n    // Your code here\n    int len = strlen(s);\n    for(int i = 0; i < len/2; i++) {\n        char temp = s[i];\n        s[i] = s[len-1-i];\n        s[len-1-i] = temp;\n    }\n}\n\nint main() {\n    char s[100];\n    scanf("%s", s);\n    reverseString(s);\n    printf("%s", s);\n    return 0;\n}'
        }
    }
];

// Sample Programming Questions
const programmingQuestions = [
    {
        questionId: 'PROG001',
        type: 'Programming',
        title: 'FizzBuzz',
        description: 'Write a program that prints numbers from 1 to n. For multiples of 3 print "Fizz", for multiples of 5 print "Buzz", and for multiples of both print "FizzBuzz".',
        difficulty: 'Easy',
        timeLimit: 15,
        constraints: '1 <= n <= 100',
        examples: [
            {
                input: 'n = 15',
                output: '1\\n2\\nFizz\\n4\\nBuzz\\nFizz\\n7\\n8\\nFizz\\nBuzz\\n11\\nFizz\\n13\\n14\\nFizzBuzz',
                explanation: 'Numbers divisible by 3 become Fizz, by 5 become Buzz, by both become FizzBuzz'
            }
        ],
        tags: ['Logic', 'Loops'],
        testCases: [
            { input: '5', expectedOutput: '1\n2\nFizz\n4\nBuzz', isHidden: false },
            { input: '15', expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz', isHidden: false },
            { input: '3', expectedOutput: '1\n2\nFizz', isHidden: true }
        ],
        starterCode: {
            python: 'def fizzbuzz(n):\n    # Your code here\n    for i in range(1, n+1):\n        if i % 15 == 0:\n            print("FizzBuzz")\n        elif i % 3 == 0:\n            print("Fizz")\n        elif i % 5 == 0:\n            print("Buzz")\n        else:\n            print(i)\n\nn = int(input())\nfizzbuzz(n)',
            javascript: 'function fizzbuzz(n) {\n    // Your code here\n    for(let i = 1; i <= n; i++) {\n        if(i % 15 === 0) console.log("FizzBuzz");\n        else if(i % 3 === 0) console.log("Fizz");\n        else if(i % 5 === 0) console.log("Buzz");\n        else console.log(i);\n    }\n}\n\nconst n = parseInt(require("fs").readFileSync(0, "utf-8").trim());\nfizzbuzz(n);',
            java: 'import java.util.*;\n\npublic class Solution {\n    public static void fizzbuzz(int n) {\n        // Your code here\n        for(int i = 1; i <= n; i++) {\n            if(i % 15 == 0) System.out.println("FizzBuzz");\n            else if(i % 3 == 0) System.out.println("Fizz");\n            else if(i % 5 == 0) System.out.println("Buzz");\n            else System.out.println(i);\n        }\n    }\n    \n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        fizzbuzz(n);\n    }\n}',
            cpp: '#include <iostream>\nusing namespace std;\n\nvoid fizzbuzz(int n) {\n    // Your code here\n    for(int i = 1; i <= n; i++) {\n        if(i % 15 == 0) cout << "FizzBuzz" << endl;\n        else if(i % 3 == 0) cout << "Fizz" << endl;\n        else if(i % 5 == 0) cout << "Buzz" << endl;\n        else cout << i << endl;\n    }\n}\n\nint main() {\n    int n;\n    cin >> n;\n    fizzbuzz(n);\n    return 0;\n}',
            c: '#include <stdio.h>\n\nvoid fizzbuzz(int n) {\n    // Your code here\n    for(int i = 1; i <= n; i++) {\n        if(i % 15 == 0) printf("FizzBuzz\\n");\n        else if(i % 3 == 0) printf("Fizz\\n");\n        else if(i % 5 == 0) printf("Buzz\\n");\n        else printf("%d\\n", i);\n    }\n}\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    fizzbuzz(n);\n    return 0;\n}'
        }
    },
    {
        questionId: 'PROG002',
        type: 'Programming',
        title: 'Factorial Calculator',
        description: 'Write a program to calculate the factorial of a given number n. Factorial of n (n!) is the product of all positive integers less than or equal to n.',
        difficulty: 'Easy',
        timeLimit: 10,
        constraints: '0 <= n <= 20',
        examples: [
            {
                input: 'n = 5',
                output: '120',
                explanation: '5! = 5 × 4 × 3 × 2 × 1 = 120'
            }
        ],
        tags: ['Math', 'Recursion'],
        testCases: [
            { input: '5', expectedOutput: '120', isHidden: false },
            { input: '0', expectedOutput: '1', isHidden: false },
            { input: '10', expectedOutput: '3628800', isHidden: true }
        ],
        starterCode: {
            python: 'def factorial(n):\n    # Your code here\n    if n == 0:\n        return 1\n    return n * factorial(n-1)\n\nn = int(input())\nprint(factorial(n))',
            javascript: 'function factorial(n) {\n    // Your code here\n    if(n === 0) return 1;\n    return n * factorial(n-1);\n}\n\nconst n = parseInt(require("fs").readFileSync(0, "utf-8").trim());\nconsole.log(factorial(n));',
            java: 'import java.util.*;\n\npublic class Solution {\n    public static long factorial(int n) {\n        // Your code here\n        if(n == 0) return 1;\n        return n * factorial(n-1);\n    }\n    \n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(factorial(n));\n    }\n}',
            cpp: '#include <iostream>\nusing namespace std;\n\nlong long factorial(int n) {\n    // Your code here\n    if(n == 0) return 1;\n    return n * factorial(n-1);\n}\n\nint main() {\n    int n;\n    cin >> n;\n    cout << factorial(n);\n    return 0;\n}',
            c: '#include <stdio.h>\n\nlong long factorial(int n) {\n    // Your code here\n    if(n == 0) return 1;\n    return n * factorial(n-1);\n}\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    printf("%lld", factorial(n));\n    return 0;\n}'
        }
    }
];

// Seed function
async function seedQuestions() {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/authlessx';
        await mongoose.connect(mongoURI);
        
        console.log('✅ Connected to MongoDB');
        
        // Clear existing questions
        await Question.deleteMany({});
        console.log('🗑️  Cleared existing questions');
        
        // Insert DSA questions
        await Question.insertMany(dsaQuestions);
        console.log(`✅ Added ${dsaQuestions.length} DSA questions`);
        
        // Insert Programming questions
        await Question.insertMany(programmingQuestions);
        console.log(`✅ Added ${programmingQuestions.length} Programming questions`);
        
        console.log('🎉 Successfully seeded all questions!');
        console.log(`📊 Total questions: ${dsaQuestions.length + programmingQuestions.length}`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding questions:', error);
        process.exit(1);
    }
}

seedQuestions();
