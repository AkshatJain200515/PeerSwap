export default function Validateemail(email) {
    const atParts = email.split("@");
    // Logic: Minimum length check (e.g., a@b.c is 5 chars)
    if (email.length < 5) return false;
    
    // Must contain an @ symbol
    if (!email.includes("@")) return false;

    // Must contain a dot '.' after the @ symbol
    if (!atParts[1].includes(".")) return false;

    // Block common invalid characters for security
    const forbiddenChars = ['<', '>', '(', ')', ';', ':'];
    for (let char of forbiddenChars) {
        if (email.includes(char)) return false;
    }

    return true;
}