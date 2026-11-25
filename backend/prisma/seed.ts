import prisma from "../src/db"

async function main() {
  // Create clinics
  const clinics = await prisma.clinic.createMany({
    data: [
      {
        id: "clinic-1",
        name: "Central Community Clinic",
        area: "Market Street · 1.2 km",
        distanceKm: 1.2,
        address: "Plot 42, Market Street, Central Ward",
        open: true,
        wait: "35–50 min",
        updated: "Updated 2 min ago",
        rule: "REMOTE",
        phone: "+254 20 555 0101",
        transit: "Stage 4, Market Junction (Bus 23, Matatu 11A)",
        latitude: -1.2833,
        longitude: 36.8219,
        patientsAhead: 14,
      },
      {
        id: "clinic-2",
        name: "Riverside Public Health Centre",
        area: "River Road · 2.8 km",
        distanceKm: 2.8,
        address: "18 River Road, Near Riverside Sub-County Office",
        open: true,
        wait: "15–25 min",
        updated: "Updated 8 min ago",
        rule: "ARRIVAL",
        phone: "+254 20 555 0102",
        transit: "River Stage (Matatu 34B, Walk 3 mins)",
        latitude: -1.2815,
        longitude: 36.8292,
        patientsAhead: 6,
      },
      {
        id: "clinic-3",
        name: "Highlands Family Health Clinic",
        area: "Highlands Hill · 3.4 km",
        distanceKm: 3.4,
        address: "74 Hillside Drive, Highlands Block B",
        open: true,
        wait: "20–30 min",
        updated: "Updated 5 min ago",
        rule: "REMOTE",
        phone: "+254 20 555 0103",
        transit: "Highlands Roundabout (Bus 44)",
        latitude: -1.2725,
        longitude: 36.8075,
        patientsAhead: 8,
      },
      {
        id: "clinic-4",
        name: "St. Jude Community Dispensary",
        area: "Old Town · 1.9 km",
        distanceKm: 1.9,
        address: "St. Jude Lane, Old Town Public Square",
        open: true,
        wait: "10–20 min",
        updated: "Updated 12 min ago",
        rule: "REMOTE",
        phone: "+254 20 555 0104",
        transit: "Old Town Gate (Matatu 14, 18)",
        latitude: -1.2864,
        longitude: 36.8172,
        patientsAhead: 4,
      },
      {
        id: "clinic-5",
        name: "Northgate Public Clinic",
        area: "Northgate Avenue · 4.1 km",
        distanceKm: 4.1,
        address: "Building 9, Northgate Avenue, Health Zone",
        open: false,
        wait: null,
        updated: "Closed · Opens next weekday at 8:00 AM",
        rule: "RECEPTION",
        phone: "+254 20 555 0105",
        transit: "Northgate Terminal (Bus 102)",
        latitude: -1.2197,
        longitude: 36.887,
        patientsAhead: 0,
      },
    ],
    skipDuplicates: true,
  })

  // Add services for each clinic
  const clinicServices = [
    { clinicId: "clinic-1", name: "General outpatient" },
    { clinicId: "clinic-1", name: "Immunisation" },
    { clinicId: "clinic-1", name: "Follow-up visit" },
    { clinicId: "clinic-1", name: "Pharmacy" },
    { clinicId: "clinic-2", name: "Maternal and child health" },
    { clinicId: "clinic-2", name: "Immunisation" },
    { clinicId: "clinic-2", name: "General outpatient" },
    { clinicId: "clinic-3", name: "General outpatient" },
    { clinicId: "clinic-3", name: "Dental" },
    { clinicId: "clinic-3", name: "Pharmacy" },
    { clinicId: "clinic-3", name: "Follow-up visit" },
    { clinicId: "clinic-4", name: "General outpatient" },
    { clinicId: "clinic-4", name: "Maternal and child health" },
    { clinicId: "clinic-4", name: "Immunisation" },
    { clinicId: "clinic-5", name: "General outpatient" },
    { clinicId: "clinic-5", name: "Follow-up visit" },
    { clinicId: "clinic-5", name: "Dental" },
  ]

  for (const svc of clinicServices) {
    await prisma.clinicService.upsert({
      where: { id: `${svc.clinicId}-${svc.name.replace(/\s+/g, "-")}` },
      update: {},
      create: {
        id: `${svc.clinicId}-${svc.name.replace(/\s+/g, "-")}`,
        clinicId: svc.clinicId,
        name: svc.name,
      },
    })
  }

  // Add clinic directions
  await prisma.clinicDirection.createMany({
    data: [
      { clinicId: "clinic-1", transit: "Stage 4, Market Junction (Bus 23, Matatu 11A)" },
      { clinicId: "clinic-2", transit: "River Stage (Matatu 34B, Walk 3 mins)" },
      { clinicId: "clinic-3", transit: "Highlands Roundabout (Bus 44)" },
      { clinicId: "clinic-4", transit: "Old Town Gate (Matatu 14, 18)" },
      { clinicId: "clinic-5", transit: "Northgate Terminal (Bus 102)" },
    ],
    skipDuplicates: true,
  })

  console.log("✅ Database seeded successfully")
  console.log(`📊 Created ${clinics.count} clinics`)
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
