namespace JobTracker.API.DTOs;

public record CreateJobApplicationRequest(
    string CompanyName,
    string JobTitle,
    string? JobUrl,
    string? Notes,
    DateTime? AppliedDate,
    DateTime? InterviewDate
);

public record UpdateJobApplicationRequest(
    string CompanyName,
    string JobTitle,
    string Status,
    string? JobUrl,
    string? Notes,
    DateTime? InterviewDate
);

public record JobApplicationResponse(
    int Id,
    string CompanyName,
    string JobTitle,
    string Status,
    string? JobUrl,
    string? Notes,
    DateTime AppliedDate,
    DateTime? InterviewDate,
    DateTime CreatedAt,
    DateTime UpdatedAt
);
