package com.example.revival.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private String artType;
    private String location;
    @Column(length = 2048)
    private String description;
    private String videoPath;
    private String status;
    private LocalDateTime submittedAt;

    public Submission() {}
    public Submission(String name, String artType, String location, String description, String videoPath) {
        this.name = name;
        this.artType = artType;
        this.location = location;
        this.description = description;
        this.videoPath = videoPath;
        this.status = "pending";
        this.submittedAt = LocalDateTime.now();
    }

    // getters and setters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getArtType() { return artType; }
    public String getLocation() { return location; }
    public String getDescription() { return description; }
    public String getVideoPath() { return videoPath; }
    public String getStatus() { return status; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }

    public void setStatus(String status) { this.status = status; }
}
