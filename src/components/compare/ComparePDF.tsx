import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { Townhouse } from "@/lib/types";

const COLORS = {
  charcoal: "#1E1E1E",
  charcoalLight: "#5C5C5C",
  warmWhite: "#FFFDF8",
  sand: "#E8DFD0",
  sandLight: "#F0EBE2",
  stone: "#C5B9A8",
  terracotta: "#C2694A",
  availableGreen: "#5C7A4E",
  availableBg: "#EEF4EB",
  soldRed: "#A04040",
  soldBg: "#F8EDED",
  negotiationAmber: "#B8862E",
  negotiationBg: "#FBF4E6",
  holdBlue: "#4A6E8F",
  holdBg: "#EBF1F6",
};

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  available: { label: "Available", color: COLORS.availableGreen, bg: COLORS.availableBg },
  sold: { label: "Sold", color: COLORS.soldRed, bg: COLORS.soldBg },
  negotiation: { label: "Under Negotiation", color: COLORS.negotiationAmber, bg: COLORS.negotiationBg },
  hold: { label: "On Hold", color: COLORS.holdBlue, bg: COLORS.holdBg },
  unreleased: { label: "Unreleased", color: COLORS.charcoalLight, bg: COLORS.sandLight },
};

const COMPARE_ROWS: { label: string; getValue: (th: Townhouse) => string | number; numeric?: boolean; higherBetter?: boolean }[] = [
  { label: "Area", getValue: (th) => th.area },
  { label: "Stage", getValue: (th) => th.stg },
  { label: "Config", getValue: (th) => th.desc },
  { label: "Type", getValue: (th) => th.type || "—" },
  { label: "Total Area", getValue: (th) => th.tot, numeric: true, higherBetter: true },
  { label: "Lot Size", getValue: (th) => th.lot, numeric: true, higherBetter: true },
  { label: "Ground Living", getValue: (th) => th.gI, numeric: true, higherBetter: true },
  { label: "Upper Living", getValue: (th) => th.uI, numeric: true, higherBetter: true },
  { label: "Balcony", getValue: (th) => th.uB, numeric: true, higherBetter: true },
  { label: "Patio", getValue: (th) => th.pat, numeric: true, higherBetter: true },
  { label: "Front Yard", getValue: (th) => th.eF, numeric: true, higherBetter: true },
  { label: "Back Yard", getValue: (th) => th.eB, numeric: true, higherBetter: true },
  { label: "Garage", getValue: (th) => th.gG, numeric: true, higherBetter: true },
];

const s = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: COLORS.warmWhite,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: COLORS.charcoal,
    marginBottom: 24,
  },
  table: {
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.sand,
    paddingBottom: 8,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.sandLight,
    paddingVertical: 7,
    alignItems: "center",
  },
  labelCell: {
    width: "22%",
    fontSize: 7,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: COLORS.stone,
  },
  headerCell: {
    flex: 1,
    fontSize: 14,
    fontWeight: 700,
    color: COLORS.charcoal,
  },
  dataCell: {
    flex: 1,
    fontSize: 9,
    color: COLORS.charcoal,
  },
  dataCellBest: {
    flex: 1,
    fontSize: 9,
    fontWeight: 700,
    color: COLORS.terracotta,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 7,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
});

interface ComparePDFProps {
  selected: Townhouse[];
  projectName: string;
  unitLabel: string;
  unitLabelShort: string;
  showPricing: boolean;
}

export function ComparePDF({ selected, projectName, unitLabel, unitLabelShort, showPricing }: ComparePDFProps) {
  return (
    <Document>
      <Page size="A4" orientation={selected.length > 3 ? "landscape" : "portrait"} style={s.page}>
        <Text style={s.title}>
          {projectName} — {unitLabel} Comparison
        </Text>

        <View style={s.table}>
          {/* Header */}
          <View style={s.headerRow}>
            <View style={{ width: "22%" }} />
            {selected.map((th) => (
              <Text key={th.id} style={s.headerCell}>
                {unitLabelShort} {th.id}
              </Text>
            ))}
          </View>

          {/* Data rows */}
          {COMPARE_ROWS.map((row) => {
            const values = selected.map((th) => row.getValue(th));
            const numericValues = values as number[];
            const bestIdx =
              row.numeric && row.higherBetter
                ? numericValues.indexOf(Math.max(...numericValues))
                : -1;

            return (
              <View key={row.label} style={s.row}>
                <Text style={s.labelCell}>{row.label}</Text>
                {values.map((val, i) => (
                  <Text key={i} style={i === bestIdx ? s.dataCellBest : s.dataCell}>
                    {row.numeric ? `${val}m²` : String(val)}
                  </Text>
                ))}
              </View>
            );
          })}

          {/* Price row */}
          {showPricing && (
            <View style={s.row}>
              <Text style={s.labelCell}>Price</Text>
              {selected.map((th) => (
                <Text key={th.id} style={{ ...s.dataCell, fontWeight: 700 }}>
                  {th.price || "—"}
                </Text>
              ))}
            </View>
          )}

          {/* Status row */}
          <View style={{ ...s.row, borderBottomWidth: 0 }}>
            <Text style={s.labelCell}>Status</Text>
            {selected.map((th) => {
              const cfg = STATUS_MAP[th.status] || STATUS_MAP.unreleased;
              return (
                <View key={th.id} style={{ flex: 1 }}>
                  <Text
                    style={{
                      ...s.statusBadge,
                      color: cfg.color,
                      backgroundColor: cfg.bg,
                      alignSelf: "flex-start",
                    }}
                  >
                    {cfg.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </Page>
    </Document>
  );
}
