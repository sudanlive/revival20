package com.example.revival.controller;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/videos")
public class VideoController {

    @GetMapping("/{filename}")
    public ResponseEntity<Resource> getVideo(@PathVariable String filename) {
        Path filePath = Paths.get("videos").resolve(filename).normalize();
        Resource resource = new FileSystemResource(filePath);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}