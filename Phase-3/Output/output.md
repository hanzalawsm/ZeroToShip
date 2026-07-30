# Input:

```json
{
  "prompt": "Need a plumber in jauhar on august 1st during the day."
}
```

# Output:

```json
{
  "intent": {
    "service": "plumber",
    "location": "Johar",
    "time": "August 1st during the day"
  },
  "top_provider": {
    "name": "Johar Handy Plumbers",
    "category": "plumber",
    "rating": 3.9,
    "neighborhood_zone": "Johar",
    "provider_id": 9
  },
  "all_matches": [
    {
      "name": "Johar Handy Plumbers",
      "category": "plumber",
      "rating": 3.9,
      "neighborhood_zone": "Johar",
      "provider_id": 9
    }
  ],
  "explanation": "Johar Handy Plumbers is the ideal choice because they match your required service (plumber) and location (Johar). Additionally, they are the only available provider that fits your exact criteria."
}
```

# Input:

```json
{
  "prompt": "Gulshan me electrician chahiye kal sham 4 baje"
}
```

# Output:

```json
{
  "intent": {
    "service": "electrician",
    "location": "Gulshan",
    "time": "kal sham 4 baje"
  },
  "top_provider": {
    "name": "Gulshan Electric Point",
    "category": "electrician",
    "rating": 4.6,
    "neighborhood_zone": "Gulshan",
    "provider_id": 10
  },
  "all_matches": [
    {
      "name": "Gulshan Electric Point",
      "category": "electrician",
      "rating": 4.6,
      "neighborhood_zone": "Gulshan",
      "provider_id": 10
    }
  ],
  "explanation": "Gulshan Electric Point was selected because it matches the requested service (electrician) and location (Gulshan). Additionally, it is the only matching provider available, and it holds a strong rating of 4.6/5.0."
}
```