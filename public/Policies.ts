export interface Rule {
  title: string;
  id: number;
  subRules?: SubRule[];
}

interface SubRule {
  title?: string;
  content?: string;
  id: number;
  subSections?: SubSection[];
}

interface SubSection {
  content: string;

}

const rules: Rule[] = [
  {
      title: "Content Restrictions",
      id: 1,
      subRules: [
          {
              title: "Only titles that are in the comic styles of Japanese, Korean, Chinese or of similar Asian origin are allowed. Exceptions can be made for self-published comics in a similar style originally created in other languages if you contact MangArchive staff beforehand.",
              id: 1,
              subSections: [
                  { content: "Permission has been granted by the publisher and/or creator;" },
                  { content: "The uploader is the publisher;" },
                  { content: "The license has expired;" },
                  { content: "The series is out of print;" },
                  { content: "The publisher is defunct; or" },
                  { content: "The release can no longer be purchased via sources provided by the publisher." }
              ]
          },
          {
              title: "Releases qualifying under the previously mentioned exemptions should be uploaded under the group \"[Publisher] (Ex-Licenses)\" when applicable, and are treated as scanlations for the purpose of all rules.",
              id: 2,
              subSections: [
                  { content: "Do not upload the ex-licensed version if there is no significant difference in quality with available scanlations of the chapters in question." },
                  { content: "If a different publisher has created a different official release, the ex-licensed release from a previous publisher may still be uploaded." },
                  { content: "If the ex-licensed release from a publisher is relicensed by another company, it cannot be uploaded." }
              ]
          },
          {
              title: "Any scanlated release is allowed to be uploaded regardless of the existence of official translations, except under the following restrictions:",
              id: 3,
              subSections: [
                  { content: "If a release has one group and this group has enabled upload restrictions, only their group members may upload it. Users who deliberately circumvent group upload restrictions will have their chapter uploading privileges restricted." },
                  { content: "If a release has multiple groups and at least one of the groups is unlocked, the chapter can be uploaded without adding the locked groups. A member of one of the locked groups can contact MangArchive staff and ask for their group to be added to the release." },
                  { content: "Both using the translated script and raw images of an official release as the basis of a scanlation are allowed only if the scanlated release has been re-translated into a different language." },
                  { content: "Both using the translated script and images of a scanlation as the basis of a new scanlation are generally allowed as long as there is a significant difference from the source release, such as being translated to another language, having significantly improved typesetting, or higher quality raws." },
                  { content: "Joke or troll releases are not allowed, except on April 1st." },
                  { content: "These releases will be collected and moved to a separate title page after April 1st has ended." }
              ]
          },
          {
              title: "A locked group that has chapters missing from MangArchive can be requested by a user to be unlocked and marked as inactive by contacting MangArchive staff if the locked group has had no publicly available releases for 4 months on any platform. MangArchive staff will attempt to contact the group to notify them about the inactivity request and will continue to wait another 2 months from the request before marking the group as inactive.",
              id: 4,
              subSections: [
                  { content: "A group that is marked as inactive will have its upload restrictions lifted and its leader and members will no longer have edit permissions to the chapters associated with the group, to allow for the uploading of any missing chapters." },
                  { content: "Should an inactive group resume releasing new content consistently enough, normal permissions can be restored." },
                  { content: "MangArchive may continue to honor requests from inactive groups to leave specific series/chapters removed on a case by case basis, such as if the group wants to show support for the official licensed version. An inactivity request will be invalid if this case applies." },
                  { content: "A group that has publicly announced their disbanding or retirement does not qualify for the wait period and will be immediately marked as inactive upon user request." }
              ]
          },
          { title: "Chapters from groups linking to websites which adopt excessive profiteering techniques are not allowed. Examples include, but are not limited to: adblock-blockers, hidden redirects, clickjackers, pop-ups and pop-unders.", id: 5 },
          { title: "Publishing a scanlated chapter before the official raw chapter is released in the original country is prohibited.", id: 6 },
          { title: "Uploading a chapter created by a tool that automatically edits and generates translated pages is not allowed. This includes tools that allow for additional manual editing after the automated process.", id: 7 },
          { title: "Permanently withholding some of your scanlations to a series for the purpose of attracting users to your site is not allowed.", id: 8 }
      ]
  },
  {
      title: "Title Entry Guidelines",
      id: 2,
      subRules: [
          {
              title: "Title Creation",
              id: 1,
              subSections: [
                  { content: "Do not add duplicate entries. Search for multiple alternate titles to confirm it doesn't exist yet before adding a series. Check your language and content filters to make sure you're not inadvertently hiding the work." },
                  { content: "If there happen to be multiple distinct entries with the same title, do not add anything to distinguish them, such as \"(Author name)\". Use the actual title as it is." },
                  { content: "Oneshots that were published in an anthology should be included in the respective anthology entry and should not have their own entries." },
                  { content: "A single-chapter oneshot that has been serialized should have its own entry which is linked to the serialized entry using the \"Serialization/Pre-Serialization\" relation." },
                  { content: "A non-user self-published comic with multiple chapters that has been serialized should have its own separate entry. If the serialized comic uses the same title, the pre-serialized entry should have \"(Pre-Serialization)\" or the equivalent appended to the main title." },
                  { content: "Chapters that have been colored from a monochrome version (either Official or Fan Colored) should be uploaded under a separate entry that must be tagged as \"Official/Fan Colored\", have \"(Official/Fan Colored)\" appended to the main title and include a \"Colored\" relation to the main title. \"Official Colored\" means the work was originally monochrome and this is an official colored variant. Similarly, \"Fan Colored\" is reserved for non-official coloring of monochrome work. \"Full Color'' means the work was originally in color, and no monochrome version exists." }
              ]
          },
          {
              title: "Title Metadata",
              id: 2,
              subSections: [
                  { content: "The description should only contain a description of the title. Place links and other details in their appropriate locations. Links should lead to primary sources, such as the artist or publisher's page for the series." },
                  { content: "The content rating for a series is based on the highest level of sexual content in the series. In general, entries that focus on sex or contain uncensored sex scenes should be marked as pornographic, entries with heavily censored or non-explicit sex as erotica, and entries with light exposure as suggestive." },
                  { content: "A series may receive a higher content rating based on several factors, such as an entry that is fully censored but completely focused on the depiction of sex. Contact MangArchive staff if you aren't sure." },
                  { content: "The final chapter fields should be set to the final full chapter's number or the final chapter as marked by the publisher if possible. Leave blank for oneshots." },
                  { content: "The publication status refers to the status of publication in the country of origin, not the scanlation status of the title." },
                  { content: "For Japanese manga, the demographic is based on the established target demographic of the magazine a series is published in regardless of the title's content. If the series is not published in a magazine, leave the field blank." },
                  { content: "Genre and theme tags should be added only if the tag is a representation of the title as a whole, not just appearing in a single chapter." }
              ]
          },
          {
              title: "Cover Art",
              id: 3,
              subSections: [
                  { content: "File type: JPG/JPEG, PNG, or GIF." },
                  { content: "Portrait orientation." },
                  { content: "Use the highest resolution available (minimum 300px * 450px)." },
                  { content: "All cover art should be unmodified and not translated by users. Officially translated covers can be uploaded, and must be tagged with the correct language." },
                  { content: "All titles must have a main cover." },
                  { content: "The main cover should be one of the covers in the original language that the series was published in." },
                  { content: "Use a cover image of a later volume, unless it either doesn't represent the overall art style and theme of the comic, or has major spoilers." },
                  { content: "If no cover art exists, you may use one of the first pages of the first chapter as the cover." },
                  { content: "Bonus/variant covers, like the flip cover on a physical release, should be added as Volume x.1." }
              ]
          },
          {
              title: "Naming Conventions",
              id: 4,
              subSections: [
                  { content: "The language set for a title should reflect the official or officially localized name for that language region." },
                  { content: "Use the Chicago style title case for formatting English titles, and prefer Modified/Revised Hepburn for Japanese romanization." },
                  { content: "Loan words are to be as they are in their original respective language. For example: \"異世界ライフ\" to \"Isekai Life\"." },
                  { content: "Only add official titles, official abbreviations, romanizations, or full proper translations as titles." }
              ]
          }
      ]
  },
  {
      title: "Chapter Release Guidelines",
      id: 3,
      subRules: [
          {
              title: "File Limitations",
              id: 1,
              subSections: [
                  { content: "A chapter as a whole must not exceed 500 images or 200MB in size." },
                  { content: "Any individual image in the chapter must not exceed 20MB in size or 10000px * 10000px in resolution." },
                  { content: "Images taller than 10000 pixels will be automatically split by the upload tool when uploading a chapter to a series tagged as longstrip." }
              ]
          },
          {
              title: "Content",
              id: 2,
              subSections: [
                  { content: "Do not arbitrarily combine several chapters into a single release." },
                  { content: "Chapters may only be split into parts if the source material was also split in the same way. Chapters that have been split up by the scanlators for any other reason may be recombined into singular whole chapters." },
                  { content: "Do not combine book-style pages of a chapter into a vertical longstrip image (e.g. merging a book page with other book pages, credit pages, notes, etc). Double page spreads of paged content should be combined into a single page, as this is how they are intended to be read." },
                  { content: "If you are not part of the scanlation group, do not alter the release you are uploading by any means." },
                  { content: "Aggregator watermarks are not allowed. Watermarks from raw provider sites should be avoided when possible, but are not explicitly banned." },
                  { content: "Source uploads directly from the scanlator when possible. Avoid uploading compressed chapters from other aggregators unless there is no other option." },
                  { content: "All content that isn't strictly part of the original scanlated chapter is considered \"extraneous\". Examples of this include credits pages, recruitment notices, discussion, fan-colored chapter pages, and other fan art. Extraneous content is generally allowed, but must be placed either at the beginning or the end of the release." }
              ]
          },
          {
              title: "Groups",
              id: 3,
              subSections: [
                  { content: "When uploading a chapter, select all the groups that worked on it. If one of the groups does not exist on the site yet, create it first." },
                  { content: "If you do not yet know who scanlated the chapter, do not upload it." },
                  { content: "If the creator of the scanlation does not have a group, create a group named after their username and assign the chapter to this group." },
                  { content: "Only the scanlator may choose the \"Not affiliated with any group\" option." },
                  { content: "If all the groups associated with the release are locked, only the relevant group members may upload the chapter." },
                  { content: "If you are one of the relevant group members and aren't in all of the locked groups, upload the chapter with the groups that you can and ask the locked group(s) to contact MangArchive staff to be added." }
              ]
          },
          {
              title: "Naming Conventions",
              id: 4,
              subSections: [
                  { content: "Fill in all the available information." },
                  { content: "If the chapter has no title, do not add one." },
                  { content: "Don't add your own made up descriptors to any field, such as \"[HQ]\" or \"v2\" to the chapter title. The only allowed descriptors at this time are \"Censored/Uncensored\"." },
                  { content: "Only add volume numbers to chapters that have been published together in a volume. If the chapter has not been published in a volume yet, do not guess what volume it should be in, just leave the volume field blank." },
                  { content: "For entries that use season numbering (such as some Korean webtoons), use the volume field for the season number." },
                  { content: "Use decimals (1.1, 1.5, etc.) for chapters that are split into parts, or for bonus chapters/volume extras/etc." }
              ]
          }
      ]
  },
  {
      title: "Code of Conduct",
      id: 4,
      subRules: [
          { title: "Misidentifying yourself as MangArchive staff will result in a ban.", id: 1 },
          { title: "MangArchive does not condone contacting groups about changing their restrictions or uploading their releases. If you are contacting a group, be polite, and make it clear you are not associated with MangArchive.", id: 2 },
          { title: "Do not report any releases for any translation or visual quality issues that originate from the scanlator. These reports will be ignored and your ability to make reports may be restricted.", id: 3 },
          { title: "The use of multiple accounts is permitted but not guaranteed protection. Using alternative accounts for rule-breaking or evading moderator action may lead to moderator action against all of your accounts.", id: 4 },
          { title: "Abusing any features of the website (such as titles, groups, reports or covers) for the purpose of advertising, trolling, or other malicious behavior will result in a ban.", id: 5 },
          { title: "Data standardization of MangArchive content metadata is solely decided by MangArchive staff. Adding or editing content metadata en masse with the purpose of pushing some personal kind of formatting or standardization will result in moderator action and the restriction of your editing privileges.", id: 6 },
          { title: "The usage of automated tools for mass uploading and especially editing is highly discouraged due to the increased likelihood of compounding mistakes. Users are responsible for fixing problems they cause or risk the restriction of their editing privileges.", id: 7 },
          { title: "Avoid edit wars. If another user edits an entry to something different from what you had previously edited and you disagree with their edit, do not change it back, and instead notify MangArchive staff by using the report function.", id: 8 }
      ]
  }
];
export default rules