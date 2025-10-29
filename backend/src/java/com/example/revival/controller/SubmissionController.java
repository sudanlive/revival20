package com.example.revival.controller;

import com.example.revival.model.Submission;
import com.example.revival.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api")
public class SubmissionController {

    @Autowired
    private SubmissionRepository repo;

    @PostMapping("/submissions")
    public Submission addSubmission(@RequestParam("file") MultipartFile file,
                                    @RequestParam String name,
                                    @RequestParam String artType,
                                    @RequestParam String location,
                                    @RequestParam String description) throws IOException {
        String dir = System.getProperty("user.dir") + "/videos";
        Files.createDirectories(Paths.get(dir));
        String path = dir + "/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
        file.transferTo(new File(path));

        Submission sub = new Submission(name, artType, location, description, path);
        return repo.save(sub);
    }

    @GetMapping("/gallery")
    public List<Submission> getApproved() {
        return repo.findByStatus("approved");
    }

    @GetMapping("/pending")
    public List<Submission> getPending() {
        return repo.findByStatus("pending");
    }

    @PostMapping("/admin/approve/{id}")
    public Submission approve(@PathVariable Long id) {
        Submission s = repo.findById(id).orElseThrow();
        s.setStatus("approved");
        return repo.save(s);
    }

    @DeleteMapping("/admin/reject/{id}")
    public void reject(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
