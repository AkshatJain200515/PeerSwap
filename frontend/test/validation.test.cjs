const validateModule = require("../src/Utils/validate.js");
const Validateemail = validateModule.default || validateModule;

describe("Comprehensive Email Validation Tests", () => {
    
    test("should reject emails that are too short", () => {
        expect(Validateemail("a@b")).toBe(false);
    });

    test("should reject emails without an @ symbol", () => {
        expect(Validateemail("myemail.com")).toBe(false);
    });

    test("should reject emails with multiple @ symbols", () => {
        expect(Validateemail("test@@gmail.com")).toBe(false);
    });

    test("should reject emails with invalid characters (XSS protection)", () => {
        expect(Validateemail("user<script>@test.com")).toBe(false);
    });

    test("should reject domains without a suffix", () => {
        expect(Validateemail("student@gisma")).toBe(false);
    });

    test("should accept valid university and standard emails", () => {
        expect(Validateemail("student@gisma.edu")).toBe(true);
        expect(Validateemail("akshat@test.com")).toBe(true);
    });
});