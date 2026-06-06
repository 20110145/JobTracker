using System.Security.Claims;
using JobTracker.API.Data;
using JobTracker.API.DTOs;
using JobTracker.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class JobApplicationsController : ControllerBase
{
    private readonly AppDbContext _db;

    public JobApplicationsController(AppDbContext db)
    {
        _db = db;
    }

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<ActionResult<List<JobApplicationResponse>>> GetAll()
    {
        var apps = await _db.JobApplications
            .Where(j => j.UserId == GetUserId())
            .OrderByDescending(j => j.CreatedAt)
            .Select(j => ToResponse(j))
            .ToListAsync();

        return Ok(apps);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<JobApplicationResponse>> GetById(int id)
    {
        var app = await _db.JobApplications
            .FirstOrDefaultAsync(j => j.Id == id && j.UserId == GetUserId());

        if (app is null) return NotFound();

        return Ok(ToResponse(app));
    }

    [HttpPost]
    public async Task<ActionResult<JobApplicationResponse>> Create(CreateJobApplicationRequest request)
    {
        var app = new JobApplication
        {
            UserId = GetUserId(),
            CompanyName = request.CompanyName,
            JobTitle = request.JobTitle,
            JobUrl = request.JobUrl,
            Notes = request.Notes,
            AppliedDate = request.AppliedDate ?? DateTime.UtcNow,
            InterviewDate = request.InterviewDate
        };

        _db.JobApplications.Add(app);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = app.Id }, ToResponse(app));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<JobApplicationResponse>> Update(int id, UpdateJobApplicationRequest request)
    {
        var app = await _db.JobApplications
            .FirstOrDefaultAsync(j => j.Id == id && j.UserId == GetUserId());

        if (app is null) return NotFound();

        app.CompanyName = request.CompanyName;
        app.JobTitle = request.JobTitle;
        app.Status = request.Status;
        app.JobUrl = request.JobUrl;
        app.Notes = request.Notes;
        app.InterviewDate = request.InterviewDate;
        app.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(ToResponse(app));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var app = await _db.JobApplications
            .FirstOrDefaultAsync(j => j.Id == id && j.UserId == GetUserId());

        if (app is null) return NotFound();

        _db.JobApplications.Remove(app);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var apps = await _db.JobApplications
            .Where(j => j.UserId == GetUserId())
            .ToListAsync();

        return Ok(new
        {
            Total = apps.Count,
            Applied = apps.Count(j => j.Status == "Applied"),
            Interviewing = apps.Count(j => j.Status == "Interviewing"),
            Offered = apps.Count(j => j.Status == "Offered"),
            Rejected = apps.Count(j => j.Status == "Rejected")
        });
    }

    private static JobApplicationResponse ToResponse(JobApplication j) => new(
        j.Id, j.CompanyName, j.JobTitle, j.Status,
        j.JobUrl, j.Notes, j.AppliedDate, j.InterviewDate,
        j.CreatedAt, j.UpdatedAt
    );
}
